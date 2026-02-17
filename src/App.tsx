import React, { useState } from 'react';
import { Input, Button, Card, Typography, Space, Checkbox, Select, ConfigProvider } from 'antd';
import { SendOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const languages = [
  { code: 'ko', name: '한국어' }, { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }, { code: 'zh', name: '简体中文' },
  { code: 'ar', name: 'العربية' }, { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' }, { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ru', name: 'Русский' }, { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, { code: 'hi', name: 'हिन्दी' }
];

const translations: Record<string, any> = {
  ko: { title: '어느덧, 요리', subtitle: '남은 재료가 근사한 한 끼가 되는 순간', placeholder: '계란, 라면, 대파', button: '오늘의 요리 레시피', seasoning: '추가 양념(고추장, 참기름, 김 등) 사용' },
  en: { title: 'Suddenly Cooking', subtitle: 'When leftovers become a great meal', placeholder: 'Egg, Ramen, Leek', button: 'Get Recipe', seasoning: 'Use extra seasoning' },
  ja: { title: 'いつの間にか、料理', subtitle: '残った材料が素敵な食事になる瞬間', placeholder: '卵、ラーメン、ネギ', button: '今日のレシピ', seasoning: '追加調味料の使用' },
  zh: { title: '转眼间, 料理', subtitle: '剩余食材化身为美味佳肴的瞬间', placeholder: '鸡蛋, 方便面, 大葱', button: '今日食谱', seasoning: '使用额外调料' },
  ar: { title: 'فجأة، الطبخ', subtitle: 'تحويل بقايا الطعام إلى وجبة رائعة', placeholder: 'بيضة، رامين، بصل', button: 'احصل على الوصفة', seasoning: 'إضافة توابل' },
  vi: { title: 'Bỗng dưng, Nấu ăn', subtitle: 'Khi nguyên liệu thừa trở thành bữa ăn', placeholder: 'Trứng, Mì, Hành', button: 'Lấy công thức', seasoning: 'Thêm gia vị' },
  th: { title: 'ในที่สุด, การปรุงอาหาร', subtitle: 'เปลี่ยนวัตถุดิบเหลือเป็นมื้อพิเศษ', placeholder: 'ไข่, ราเมน, ต้นหอม', button: 'รับสูตร', seasoning: 'เพิ่มเครื่องปรุง' },
  id: { title: 'Tiba-tiba, Memasak', subtitle: 'Saat sisa bahan menjadi hidangan lezat', placeholder: 'Telur, Ramen, Daun Bawang', button: 'Dapatkan Resep', seasoning: 'Bumbu tambahan' },
  ru: { title: 'Вдруг, Кулинария', subtitle: 'Когда остатки становятся блюдом', placeholder: 'Яйцо, Лапша, Лук', button: 'Рецепт', seasoning: 'Специи' },
  fr: { title: 'Soudain, la Cuisine', subtitle: 'Quand les restes deviennent un repas', placeholder: 'Œuf, Ramen, Poireau', button: 'Recette', seasoning: 'Assaisonnements' },
  de: { title: 'Plötzlich, Kochen', subtitle: 'Wenn Reste zu einer Mahlzeit werden', placeholder: 'Ei, Ramen, Lauch', button: 'Rezept', seasoning: 'Gewürze' },
  hi: { title: 'अचानक, खाना बनाना', subtitle: 'बचे हुए खाने से शानदार भोजन', placeholder: 'अंडा, रामेन, प्याज', button: 'नुस्खा', seasoning: 'अतिरिक्त मसाले' }
};

const App: React.FC = () => {
  const [lang, setLang] = useState('ko');
  const [ingredients, setIngredients] = useState('');
  const [useExtra, setUseExtra] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState('');

  const t = translations[lang] || translations.en;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#8B736A', borderRadius: 12 } }}>
      <div style={{ minHeight: '100vh', background: '#EAEAEA', display: 'flex', flexDirection: 'column' }}>
        
        {/* 상단 언어 선택 (깔끔하게 우측 상단 배치) */}
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Select 
            value={lang}
            variant="borderless"
            style={{ width: 120, background: 'rgba(255,255,255,0.5)', borderRadius: '20px' }} 
            onChange={setLang}
            options={languages.map(l => ({ value: l.code, label: l.name }))}
            suffixIcon={<GlobalOutlined />}
          />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px 60px' }}>
          <Space direction="vertical" size={40} style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
            
            {/* 요리사 아이콘 (그림 대신 이모지로 세련되게) */}
            <div style={{ fontSize: '60px' }}>👨‍🍳</div>

            <div style={{ marginBottom: '20px' }}>
              <Title level={1} style={{ margin: 0, fontWeight: 800, color: '#333', letterSpacing: '-1px' }}>{t.title}</Title>
              <Text style={{ fontSize: '16px', color: '#777' }}>{t.subtitle}</Text>
            </div>
            
            <div style={{ width: '100%', textAlign: 'left' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Checkbox checked={useExtra} onChange={e => setUseExtra(e.target.checked)} style={{ color: '#555' }}>
                    {t.seasoning}
                  </Checkbox>
                </div>
                
                <TextArea 
                  rows={4} 
                  placeholder={t.placeholder}
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                  style={{ 
                    padding: '20px', 
                    fontSize: '16px', 
                    border: 'none', 
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    background: '#F5F5F5'
                  }}
                />
                
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }} 
                  loading={loading}
                  style={{ 
                    height: '60px', 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    background: '#8B736A', 
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(139, 115, 106, 0.3)',
                    marginTop: '10px'
                  }}
                >
                  {t.button}
                </Button>
              </Space>
            </div>

            {recipe && (
              <Card bordered={false} style={{ textAlign: 'left', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <Text style={{ fontSize: '16px', lineHeight: '1.8' }}>{recipe}</Text>
              </Card>
            )}
          </Space>
        </div>

        {/* 푸터 (오너님 요청 반영) */}
        <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
          어느덧, 요리 ©2026 Created by kkhafrog
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;