export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error("❌ 서버 환경변수에 GEMINI_API_KEY가 없습니다.");
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  const { ingredients, useExtra, lang } = req.body;

  try {
    // 💡 v1beta보다 안정적인 v1 사용 및 정확한 모델명 지정
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `사용자 재료: ${ingredients}. 기본양념 포함 여부: ${useExtra ? '예' : '아니오'}. 
            위 재료들을 활용해서 맛있는 요리 레시피를 1개 추천해줘. 
            반드시 ${lang} 언어로 답변해주고, 요리 이름, 재료 손질, 조리 순서(번호순)로 친절하게 설명해줘.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    // 구글 API에서 에러를 보낸 경우
    if (data.error) {
      console.error("❌ Gemini API Error:", data.error.message);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    // 정상 응답 처리
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const recipeText = data.candidates[0].content.parts[0].text;
      // 프론트엔드가 기다리는 'recipe' 키값으로 전달
      res.status(200).json({ recipe: recipeText });
    } else {
      res.status(500).json({ error: 'AI로부터 응답을 받지 못했습니다.' });
    }

  } catch (error) {
    console.error("❌ 서버 내부 로직 에러:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}