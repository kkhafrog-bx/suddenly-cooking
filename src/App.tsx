import React, { useState } from 'react';
import { Input, Button, Card, Typography, Space, Checkbox, Select, ConfigProvider, message } from 'antd';
import { GlobalOutlined, LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'ko', name: '한국어' }, { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }, { code: 'zh', name: '简体中文' },
  { code: 'ar', name: 'العربية' }, { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' }, { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ru', name: 'Русский' }, { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, { code: 'hi', name: 'हिन्दी' }
];

const translations: Record<string, any> = {
  ko: { title: '어느덧, 요리', subtitle: '남은 재료가 근사한 한 끼가 되는 순간', placeholder: '계란, 라면, 대파', button: '오늘의 요리 레시피', seasoning: '추가 양념 사용', loading: '🍳 2.5 Flash 셰프가 레시피를 생각 중...' },
  en: { title: 'Suddenly Cooking', subtitle: 'When leftovers become a meal', placeholder: 'Egg, Ramen, Leek', button: 'Get Recipe', seasoning: 'Use extra seasoning', loading: '🍳 2.5 Flash Chef is thinking...' }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<string>('ko');
  const [ingredients, setIngredients] = useState<string>('');
  const [useExtra, setUseExtra] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<string>('');

  const t = translations[lang] || translations.en;

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

      if (response.ok && data.recipe) {
        setRecipe(data.recipe);
      } else {
        throw new Error(data.error || 'Failed to get recipe');
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
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Select 
            value={lang}
            variant="borderless"
            style={{ width: 120, background: 'rgba(255,255,255,0.5)', borderRadius: '20px' }} 
            onChange={(val: string) => setLang(val)}
            options={languages.map(l => ({ value: l.code, label: l.name }))}
            suffixIcon={<GlobalOutlined />}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px 60px' }}>
          <Space direction="vertical" size={30} style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
            <div style={{ fontSize: '60px' }}>👨‍🍳</div>
            <div>
              <Title level={1} style={{ margin: 0, fontWeight: 800, color: '#333' }}>{t.title}</Title>
              <Text style={{ fontSize: '16px', color: '#777' }}>{t.subtitle}</Text>
            </div>
            
            <div style={{ width: '100%' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Checkbox checked={useExtra} onChange={e => setUseExtra(e.target.checked)}>
                  {t.seasoning}
                </Checkbox>
                <TextArea 
                  rows={2} 
                  placeholder={t.placeholder}
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
                  {t.button}
                </Button>
              </Space>
            </div>

            {loading && (
              <div style={{ marginTop: '20px' }}>
                <LoadingOutlined style={{ fontSize: 24, color: '#8B736A' }} spin />
                <br /><Text style={{ color: '#8B736A' }}>{t.loading}</Text>
              </div>
            )}

            {recipe && !loading && (
              <Card bordered={false} style={{ textAlign: 'left', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
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