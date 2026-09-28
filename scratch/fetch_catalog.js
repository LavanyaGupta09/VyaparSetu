async function search() {
  try {
    const res = await fetch(`https://api.data.gov.in/catalog/v1?api-key=wkheCgmRrnGGvb8IM8DAwSQ4xpNyIRtavYfBuCV1&format=json&limit=10&title=MSME`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

search();
