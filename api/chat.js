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
    // 💡 v1beta 주소 체계에서는 모델명 앞에 'models/'가 포함된 전체 경로가 들어가야 해!
    // 오너님의 Gemini 2.5 Flash 모델명을 정확히 입력해줘. (만약 2.5가 안되면 1.5-flash로 테스트!)
    const modelName = "gemini-1.5-flash"; // 현재 가장 안정적인 모델명으로 먼저 세팅했어. 2.5를 쓰려면 gemini-2.5-flash로 교체!
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `재료: ${ingredients}, 양념포함: ${useExtra ? '예' : '아니오'}, 언어: ${lang}로 맛있는 요리 레시피 1개를 추천해줘.` 
          }] 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // 여기서 'not found' 에러가 나면 구글이 지원하는 정확한 모델 이름이 아니라는 뜻이야.
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ recipe: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: 'AI 응답 구조가 예상과 다릅니다.' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}