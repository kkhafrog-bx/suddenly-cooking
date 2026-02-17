export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  const { ingredients, useExtra, lang } = req.body;

  try {
    // 💡 오너님의 Gemini 2.5 Flash 모델을 호출하는 정확한 주소
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `재료: ${ingredients}, 양념포함: ${useExtra ? '예' : '아니오'}, 언어: ${lang}로 맛있는 요리 레시피 1개를 추천해줘. 요리 이름, 재료 손질, 조리 순서별로 친절하게 설명해줘.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const recipeText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ recipe: recipeText });
    } else {
      res.status(500).json({ error: 'AI로부터 응답을 받지 못했습니다.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}