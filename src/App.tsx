import React, { useState } from 'react';
import { Layout, Input, Button, Card, Typography, Space, Checkbox, Spin, Select, ConfigProvider } from 'antd';
import { CoffeeOutlined, SendOutlined, GlobalOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// 1. 12개국 언어 목록 정의
const languages = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '简体中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ru', name: 'Русский' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' }
];

// 2. 각 언어별 번역 데이터
const translations: Record<string, any> = {
  ko: { title: '어느덧, 요리', subtitle: '남은 재료가 근사한 한 끼가 되는 순간', placeholder: '계란, 라면, 대파', button: '오늘의 요리 레시피', seasoning: '추가 양념 사용' },
  en: { title: 'Suddenly Cooking', subtitle: 'When leftovers become a great meal', placeholder: 'Egg, Ramen, Leek', button: 'Get Recipe', seasoning: 'Use extra seasoning' },
  ja: { title: 'いつの間にか、料理', subtitle: '残った材料が素敵な食事になる瞬間', placeholder: '卵、ラーメン、ネギ', button: '今日のレシピ', seasoning: '追加調味料' },
  zh: { title: '转眼间，料理', subtitle: '剩余食材化身为美味佳肴的瞬间', placeholder: '鸡蛋, 方便面, 大葱', button: '今日食谱', seasoning: '使用额外调料' },
  ar: { title: 'فجأة، الطبخ', subtitle: 'تحويل بقايا الطعام إلى وجبة رائعة', placeholder: 'بيضة، رامين، بصل', button: 'احصل على الوصفة', seasoning: 'إضافة توابل' },
  vi: { title: 'Bỗng dưng, Nấu ăn', subtitle: 'Khi nguyên liệu thừa trở thành bữa ăn', placeholder: 'Trứng, Mì, Hành', button: 'Lấy công식', seasoning: 'Thêm gia vị' },
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

  // 현재 선택된 언어의 번역본 가져오기 (없으면 영어)
  const t = translations[lang] || translations.en;

  const getRecipe = async () => {
    setLoading(true);
    // 실제 API 로직이 들어갈 자리 (임시 타이머)
    setTimeout(() => {
      setRecipe(lang === 'ko' ? "맛있는 레시피가 곧 나옵니다!" : "Your recipe is coming soon!");
      setLoading(false);
    }, 1000);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#722ed1' } }}>
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 20px' }}>
          <Select 
            value={lang}
            style={{ width: 140 }} 
            onChange={(value) => setLang(value)}
            options={languages.map(l => ({ value: l.code, label: l.name }))}
            suffixIcon={<GlobalOutlined />}
          />
        </Header>
        <Content style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600, textAlign: 'center' }}>
            <CoffeeOutlined style={{ fontSize: '64px', color: '#722ed1' }} />
            <Title level={1}>{t.title}</Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>{t.subtitle}</Text>
            
            <Card style={{ borderRadius: '15px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Checkbox checked={useExtra} onChange={e => setUseExtra(e.target.checked)}>
                  {t.seasoning}
                </Checkbox>
                <TextArea 
                  rows={4} 
                  placeholder={t.placeholder}
                  value={ingredients}
                  onChange={e => setIngredients(e.target.value)}
                />
                <Button type="primary" size="large" block onClick={getRecipe} loading={loading}>
                  {t.button}
                </Button>
              </Space>
            </Card>

            {recipe && (
              <Card style={{ textAlign: 'left', borderRadius: '15px' }}>
                <Text>{recipe}</Text>
              </Card>
            )}
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}>어느덧, 요리 ©2026 Created by Owner & Gemini</Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;