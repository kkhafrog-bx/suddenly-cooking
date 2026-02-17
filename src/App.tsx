import React, { useState } from 'react';
import { Input, Button, Card, Select, Tag, Checkbox } from 'antd';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('ko');
  const [useExtraPantry, setUseExtraPantry] = useState(true); 

  const isRTL = lang === 'ar';

  const t: any = {
    ko: { 
      title: "어느덧, 요리", 
      subtitle: "남은 재료가 근사한 한 끼가 되는 순간",
      placeholder: "냉장고에 남은 재료를 적어주세요 (예: 두부, 양파)", 
      btn: "오늘의 요리 레시피", // 오너님의 최종 선택!
      diff: "난이도", 
      time: "조리시간", 
      grade: "만족도", 
      steps: "고수의 비법", 
      pantry: "추가 양념(고추장, 참기름, 김 등) 사용" 
    },
    en: { 
      title: "Suddenly, Cooking", 
      subtitle: "The moment leftovers become a great meal",
      placeholder: "Enter leftover ingredients (e.g., Tofu, Onion)", 
      btn: "Today's Recipe", 
      diff: "Difficulty", 
      time: "Time", 
      grade: "Satisfaction", 
      steps: "Master's Steps", 
      pantry: "Use extra seasonings" 
    },
  };

  const getGradeStyle = (grade: string) => {
    const grades: any = {
        "최고의 집밥": { color: "#8D6E63", icon: "🏠" },
        "든든한 한 끼": { color: "#5D4037", icon: "💪" },
        "입맛 돋우는 별미": { color: "#AFB42B", icon: "✨" },
        "정겨운 시골 밥상": { color: "#795548", icon: "🍚" },
        "간편한 뚝딱 요리": { color: "#FFA000", icon: "⚡" }
    };
    return grades[grade] || { color: "default", icon: "🍳" };
  };

  const generateRecipe = async () => {
    if (!ingredients) return alert(lang === 'ko' ? "재료를 입력해주세요!" : "Please enter ingredients!");
    setLoading(true);
    setRecipe(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a veteran home cook (20 years exp) for "어느덧, 요리". 
                Language: ${lang}. 
                Ingredients: ${ingredients}.
                
                MANDATORY PANTRY: Salt, Sugar, Black Pepper, Cooking Oil(Butter/Olive oil), Water, Vinegar, Soy Sauce, Eggs, Ramen Seasoning.
                OPTIONAL PANTRY: ${useExtraPantry ? "Gochujang, Doenjang, Red Pepper Flakes, Minced Garlic, Ketchup, Mayo, Mustard, Balsamic, Sesame Oil, Perilla Oil, Oyster Sauce, Seaweed(Gim), Flour, Starch, Curry Powder." : "Mandatory list only."}
                
                RULES:
                1. VOICE: Warm, practical expert. Natural culinary terms.
                2. NAME: Simple & Honest. Main ingredient at the END.
                3. GRADE: Use one of (최고의 집밥, 든든한 한 끼, 입맛 돋우는 별미, 정겨운 시골 밥상, 간편한 뚝딱 요리).
                4. STEPS: Practical home cooking style. No symbols (**), no numbers.`
              }]
            }]
          })
        }
      );
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(text.replace(/```json|```/g, "").trim());
      
      parsedData.steps = parsedData.steps.map((s: string) => 
        s.replace(/\*\*/g, "").replace(/^\d+[\.\)\-\s]*/, "").trim()
      );
      
      setRecipe(parsedData);
    } catch (error) {
      alert("Error: 429 (Too many requests) - Please wait a minute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', minHeight: '100vh', 
      backgroundColor: '#F8F5F2', fontFamily: "'Pretendard', sans-serif" 
    }}>
      
      <div style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
        <Select value={lang} style={{ width: 100 }} onChange={(v) => setLang(v)} 
          options={[{ value: 'ko', label: '🇰🇷 KO' }, { value: 'en', label: '🇺🇸 EN' }]} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👨‍🍳</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#3E2723', margin: 0 }}>{t[lang]?.title}</h1>
        <p style={{ color: '#795548', fontSize: '1.1rem' }}>{t[lang]?.subtitle}</p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <Checkbox checked={useExtraPantry} onChange={(e) => setUseExtraPantry(e.target.checked)} style={{ color: '#5D4037' }}>
          {t[lang]?.pantry}
        </Checkbox>
      </div>
      
      <Input value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder={t[lang]?.placeholder} style={{ maxWidth: '480px', marginBottom: '25px', borderRadius: '12px', height: '60px', border: '2px solid #D7CCC8' }} />

      <Button type="primary" onClick={generateRecipe} loading={loading} style={{ backgroundColor: '#5D4037', borderRadius: '30px', height: '65px', padding: '0 50px', fontWeight: 'bold', border: 'none', fontSize: '1.2rem', boxShadow: '0 4px 14px rgba(62, 39, 35, 0.3)' }}>
        {t[lang]?.btn}
      </Button>

      {recipe && (
        <Card style={{ width: '100%', maxWidth: '650px', marginTop: '3rem', borderRadius: '30px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ color: '#3E2723', fontSize: '1.8rem', fontWeight: '700' }}>{recipe.name}</h2>
            <Tag color={getGradeStyle(recipe.grade).color} style={{ fontSize: '1rem', padding: '5px 15px', borderRadius: '15px' }}>
              {getGradeStyle(recipe.grade).icon} {recipe.grade}
            </Tag>
          </div>

          <div style={{ backgroundColor: '#FAF8F6', padding: '30px', borderRadius: '25px' }}>
            <h3 style={{ marginBottom: '20px', color: '#5D4037', borderBottom: '2px solid #D7CCC8', display: 'inline-block' }}>
              🍳 {t[lang]?.steps}
            </h3>
            <ol style={{ paddingLeft: '25px', lineHeight: '2', color: '#4E342E', fontSize: '1.1rem' }}>
                {recipe.steps.map((s: string, i: number) => (
                  <li key={i} style={{ marginBottom: '10px' }}>{s}</li>
                ))}
            </ol>
          </div>
        </Card>
      )}
    </div>
  );
};

export default App;