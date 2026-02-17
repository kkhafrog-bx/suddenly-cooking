// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients, useExtra, lang } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // Vercel 설정에서 넣어줄 키야!

  const prompt = `
    사용자 재료: ${ingredients}
    추가 양념 사용 여부: ${useExtra ? '예' : '아니오'}
    응답 언어: ${lang}
    위 재료들로 만들 수 있는 요리 레시피를 1개만 추천해줘. 
    요리 이름, 필요한 재료, 조리 순서(번호순)로 깔끔하게 작성해줘.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const recipeText = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ recipe: recipeText });
  } catch (error) {
    res.status(500).json({ error: 'AI 레시피 생성 실패' });
  }
}