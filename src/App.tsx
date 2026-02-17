import React, { useState } from 'react';
import { Input, Button, Card, Typography, Space, Checkbox, Select, ConfigProvider, message } from 'antd';
import { GlobalOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const App: React.FC = () => {
  const [lang, setLang] = useState('ko');
  const [ingredients, setIngredients] = useState('');
  const [useExtra, setUseExtra] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState('');

  const getRecipe = async () => {
    if (!ingredients.trim()) {
      message.warning(lang === 'ko' ? '재료를 입력해주세요!' : 'Please enter ingredients!');
      return;
    }
    setLoading(true);
    setRecipe(''); 

    try {
      const response = await fetch('/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, useExtra, lang }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setRecipe(data.recipe);
      } else {
        throw new Error(data.error || 'API Error');
      }
    } catch (error: any) {
      console.error(error);
      setRecipe(lang === 'ko' ? `에러 발생: ${error.message}` : `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#8B736A', borderRadius: 12 } }}>
      <div style={{ minHeight: '100vh', background: '#EAEAEA', display: 'flex', flexDirection: 'column' }}>
        
        {/* 언어 선택 섹션 */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Select 
            value={lang}
            variant="borderless"
            style={{ width: 120, background: 'rgba(255,255,255,0.5)', borderRadius: '20px' }} 
            onChange={setLang}
            options={[
              { value: 'ko', label: '한국어' },
              { value: 'en', label: 'English' }
            ]}
            suffixIcon={<GlobalOutlined />}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px 60px' }}>
          <Space direction="vertical" size={30} style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
            
            <div style={{ fontSize: '60px' }}>👨‍🍳</div>

            <div>
              <Title level={1} style={{ margin: 0, fontWeight: 800, color: '#333' }}>
                {lang === 'ko' ? '어느덧, 요리' : 'Suddenly Cooking'}
              </Title>
              <Text style={{ fontSize: '16px', color: '#777' }}>
                {lang === 'ko' ? '남은 재료가 근사한 한 끼가 되는 순간' : 'When leftovers become a great meal'}
              </Text>
            </div>
            
            <div style={{ width: '100%' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Checkbox checked={useExtra} onChange={e => setUseExtra(e.target.checked)}>
                  {lang === 'ko' ? '추가 양념 사용' : 'Use extra seasoning'}
                </Checkbox>
                
                <TextArea 
                  rows={2} 
                  placeholder={lang === 'ko' ? '예: 계란, 라면, 대파' : 'e.g. Egg, Ramen, Leek'}
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  style={{ padding: '15px', background: '#F5F5F5', border: 'none' }}
                />
                
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={getRecipe} 
                  loading={loading}
                  style={{ height: '55px', fontWeight: 'bold', background: '#8B736A' }}
                >
                  {lang === 'ko' ? '오늘의 요리 레시피' : 'Get Recipe'}
                </Button>
              </Space>
            </div>

            {/* 로딩 메시지 */}
            {loading && (
              <div style={{ marginTop: '20px' }}>
                <LoadingOutlined style={{ fontSize: 24, color: '#8B736A' }} spin />
                <br />
                <Text style={{ color: '#8B736A' }}>
                  {lang === 'ko' ? '🍳 셰프가 레시피를 생각 중이에요...' : '🍳 Chef is thinking of a recipe...'}
                </Text>
              </div>
            )}

            {/* 결과 레시피 카드 */}
            {recipe && !loading && (
              <Card bordered={false} style={{ textAlign: 'left', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginTop: '20px' }}>
                <Text style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{recipe}</Text>
              </Card>
            )}
          </Space>
        </div>

        <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
          어느덧, 요리 ©2026 Created by kkhafrog
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;