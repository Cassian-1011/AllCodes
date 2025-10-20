// netlify/functions/ocr.js
// Serverless function that calls the Plate Recognizer Snapshot Cloud API

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { base64Image } = body;
    if (!base64Image) {
      return { statusCode: 400, body: 'Missing base64Image' };
    }

    const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.PLATE_RECOGNIZER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upload: base64Image,
        regions: ['gb'],
        config: { mode: 'fast' }
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(()=>`HTTP ${response.status}`);
      console.error('Plate Recognizer error:', errText);
      return { statusCode: response.status, body: JSON.stringify({ error: errText }) };
    }

    const json = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}