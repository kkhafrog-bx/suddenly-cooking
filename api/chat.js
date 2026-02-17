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
    // 💡 v1beta 대신 v1을 사용하고 모델명을 명확히 기재
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `재료: ${ingredients}, 양념포함: ${useExtra}, 언어: ${lang}로 레시피 알려줘.` }] }]
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
      res.status(500).json({ error: 'Invalid response from AI' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}