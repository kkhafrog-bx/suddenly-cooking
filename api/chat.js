export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key Missing' });
  }

  const { ingredients, useExtra, lang } = req.body;

  try {
    // models/ 를 빼고 모델명만 붙이는 방식 (v1 사용)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}";

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `재료: ${ingredients}, 추가양념사용: ${useExtra ? '예' : '아니오'}. 
            이 재료들로 만들 수 있는 요리 레시피 1개를 ${lang === 'ko' ? '한국어' : '영어'}로 추천해줘. 
            요리 이름, 재료 리스트, 조리법 순서를 친절하게 설명해줘.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API Error' });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ recipe: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: '레시피 생성 실패' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}