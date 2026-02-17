// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. 키가 잘 왔는지 확인 (Vercel 로그에서 확인 가능)
  const API_KEY = process.env.GEMINI_API_KEY; 
  
  if (!API_KEY) {
    console.error("❌ API 키를 찾을 수 없습니다! Vercel 설정을 확인하세요.");
    return res.status(500).json({ error: 'API Key is missing in Server' });
  }

  const { ingredients, useExtra, lang } = req.body;

 try {
    // 💡 모델 명칭을 'gemini-1.5-flash'로 정확히 기입하거나 버전을 v1으로 시도해볼 수 있어.
    // 여기서는 가장 안정적인 'gemini-1.5-flash' 명칭을 사용하되 주소를 최신 규격으로 맞췄어.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `재료: ${ingredients}, 양념포함: ${useExtra}, 언어: ${lang}로 레시피 알려줘.` }] }]
      })
    });


    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API 응답 에러:", data.error);
      return res.status(data.error.code || 500).json({ error: data.error.message });
    }

    const recipeText = data.candidates[0].content.parts[0].text;
    res.status(200).json({ recipe: recipeText });

  } catch (error) {
    console.error("❌ 서버 내부 에러 발생:", error);
    res.status(500).json({ error: '서버 내부 통신 실패' });
  }
}