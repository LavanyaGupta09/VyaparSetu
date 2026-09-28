const apiKey = 'wkheCgmRrnGGvb8IM8DAwSQ4xpNyIRtavYfBuCV1';

async function search() {
  try {
    const res = await fetch(`https://api.data.gov.in/catalog/v1?api-key=${apiKey}&format=json&limit=10&title=MSME`);
    if (!res.ok) {
      console.log('Failed:', res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

search();
