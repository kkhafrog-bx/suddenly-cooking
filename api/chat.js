export default async function handler(req, res) {
  // 1. POST 요청인지 확인 (dream-app의 export async function POST와 같은 역할)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. API 키 확인 (오너님이 보여준 const apiKey = process.env.GEMINI_API_KEY 부분)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not defined in environment variables' });
  }

  const { ingredients, useExtra, lang } = req.body;

  try {
    // 3. 🌟 dream-app에서 성공했던 바로 그 주소!
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `재료: ${ingredients}, 추가양념사용: ${useExtra ? '예' : '아니오'}. 
                이 재료들로 만들 수 있는 요리 레시피 1개를 ${lang} 언어로 추천해줘. 
                요리 이름, 재료 리스트, 조리 순서를 아주 맛있게 설명해줘.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // 4. 에러 핸들링
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'AI 서비스 응답 에러' 
      });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const recipeText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ recipe: recipeText });
    } else {
      res.status(500).json({ error: '레시피를 생성할 수 없습니다.' });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}