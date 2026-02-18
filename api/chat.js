export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API Key Missing' });

  const { ingredients, useExtra, lang } = req.body;

  try {
    // 1. 사용할 수 있는 모델 목록 가져오기 (dream-app 방식)
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    let models = listData.models || [];
    
    // 2. 제미나이 모델들만 골라내기
    const candidates = models
      .filter(m => m.name.includes('gemini'))
      .map(m => m.name.split('/').pop());

    // 만약 목록을 못 가져오면 기본 모델이라도 시도
    if (candidates.length === 0) candidates.push('gemini-1.5-flash', 'gemini-pro');

    let recipe = '';
    let lastError = '';

    // 3. 될 때까지 하나씩 시도 (최대 3번)
    for (const modelId of candidates.slice(0, 3)) {
      try {
        const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
        const resp = await fetch(genUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ text: `재료: ${ingredients}, 추가양념사용: ${useExtra ? '예' : '아니오'}. 이 재료들로 요리 레시피 1개를 ${lang === 'ko' ? '한국어' : '영어'}로 추천해줘. 요리 이름, 재료 리스트, 조리법 순서로 설명해줘.` }]
            }]
          })
        });

        const data = await resp.json();
        if (resp.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          recipe = data.candidates[0].content.parts[0].text;
          break; // 성공하면 반복 중단!
        }
        lastError = data.error?.message || 'Unknown Error';
      } catch (e) {
        lastError = e.message;
      }
    }

    if (recipe) {
      res.status(200).json({ recipe });
    } else {
      res.status(500).json({ error: `모든 모델 호출 실패: ${lastError}` });
    }
  } catch (error) {
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
}