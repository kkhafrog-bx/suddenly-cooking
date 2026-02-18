export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API Key Missing' });

  const { ingredients, useExtra, lang } = req.body;

  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    let models = listData.models || [];
    const candidates = models.filter(m => m.name.includes('gemini')).map(m => m.name.split('/').pop());
    if (candidates.length === 0) candidates.push('gemini-1.5-flash');

    let recipe = '';
    for (const modelId of candidates.slice(0, 3)) {
      try {
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
        const resp = await fetch(genUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `재료: ${ingredients}, 추가양념사용: ${useExtra ? '예' : '아니오'}. 
                이 재료들로 요리 레시피 1개를 ${lang === 'ko' ? '한국어' : '영어'}로 추천해줘. 
                
                [출력 규칙]
                1. 강조를 위한 별표(**)를 절대 사용하지 마세요.
                2. 답변 시작은 '오늘의 추천 요리는 [요리명]입니다'로 시작하세요.
                3. 요리 이름, 재료 리스트(주재료/양념), 조리법 순서를 구분선(---)을 사용해 깔끔하게 작성하세요.
                4. 각 단계 앞에 적절한 이모지를 사용하세요.` 
              }]
            }]
          })
        });

        const data = await resp.json();
        if (resp.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          recipe = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch (e) { continue; }
    }

    if (recipe) {
      // 혹시라도 모델이 별표를 썼을 경우를 대비해 한 번 더 제거하는 안전장치
      const cleanRecipe = recipe.replace(/\*\*/g, '');
      res.status(200).json({ recipe: cleanRecipe });
    } else {
      res.status(500).json({ error: '레시피 생성 실패' });
    }
  } catch (error) {
    res.status(500).json({ error: '서버 에러' });
  }
}