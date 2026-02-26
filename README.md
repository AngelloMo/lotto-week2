# Lotto Week 2 Project

This project fetches and displays historical lottery winning numbers.

## Deployment to Cloudflare

If you are deploying to Cloudflare Pages, the backend functions (originally for Firebase) need to be handled by **Cloudflare Workers**.

### 1. Create a Cloudflare Worker

Go to your Cloudflare Dashboard -> Workers & Pages -> Create Worker.

### 2. Worker Code

Use the following code for your worker (it acts as a proxy to avoid CORS issues and determine the latest draw):

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/getLatestDrawNumber') {
    const latest = await findLatestDrawNumber();
    return new Response(JSON.stringify({ latestDrwNo: latest }), {
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  if (url.pathname === '/getSingleLottoNumber') {
    const drwNo = url.searchParams.get('drwNo');
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  return new Response("Not Found", { status: 404 });
}

async function findLatestDrawNumber() {
  const startDate = new Date("2002-12-07T20:00:00+09:00");
  const now = new Date();
  const diffInWeeks = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7));
  let estimatedDrwNo = diffInWeeks + 1;

  for (let drwNo = estimatedDrwNo + 1; drwNo > estimatedDrwNo - 5; drwNo--) {
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (data && data.returnValue === 'success') return drwNo;
  }
  return 1200; // Fallback
}
```

### 3. Connect Worker to Pages

In your Cloudflare Pages project settings, go to **Functions** or **Routes** to ensure the `/getLatestDrawNumber` and `/getSingleLottoNumber` paths are routed to this worker, OR simply use the worker's URL in `main.js`.

Currently, `main.js` uses relative paths which works if the Worker is bound to the same domain.
