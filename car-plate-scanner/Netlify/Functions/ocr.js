// netlify/functions/ocr.js
// This runs server-side on Netlify (hides your API key)
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { base64Image } = body;
    if (!base64Image) {
      return { statusCode: 400, body: 'Missing base64Image' };
    }

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        apikey: process.env.OCR_SPACE_KEY, // stored securely in Netlify
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base64Image,
        language: 'eng',
        isOverlayRequired: false,
        OCREngine: 2,
        detectOrientation: true
      })
    });

    const json = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
}