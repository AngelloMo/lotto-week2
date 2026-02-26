const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

// Function to find the latest draw number
async function findLatestDrawNumber() {
  // Lotto started on 2002-12-07
  const startDate = new Date("2002-12-07T20:00:00+09:00");
  const now = new Date();
  const diffInMs = now - startDate;
  const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  
  // The first draw (1st) was on 2002-12-07.
  // So the estimated latest draw number is diffInWeeks + 1.
  // We'll search around this estimate.
  let estimatedDrwNo = diffInWeeks + 1;
  
  // Search backwards from the estimate + 1 to be safe
  for (let drwNo = estimatedDrwNo + 1; drwNo > estimatedDrwNo - 5; drwNo--) {
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    try {
      const lottoResponse = await fetch(apiUrl);
      const data = await lottoResponse.json();

      if (data && data.returnValue === 'success') {
        return drwNo;
      }
    } catch (error) {
      console.error(`Error fetching drwNo ${drwNo}:`, error);
    }
  }

  // Fallback: search backwards from a known high number if the estimation fails
  for (let drwNo = 1200; drwNo > 0; drwNo--) {
      // This is a last resort and should ideally not be hit frequently
      // In a real production app, you might want to cache the latest number.
      // For now, let's just return the last successful one found.
      const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
      try {
        const lottoResponse = await fetch(apiUrl);
        const data = await lottoResponse.json();
        if (data && data.returnValue === 'success') return drwNo;
      } catch (e) {}
      if (drwNo < 1100) break; // Don't go too far back
  }

  return 0;
}


// HTTP Cloud Function to get the latest draw number
exports.getLatestDrawNumber = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    console.log("getLatestDrawNumber function invoked");

    try {
      const latestDrwNo = await findLatestDrawNumber();
      if (latestDrwNo > 0) {
        response.json({ latestDrwNo: latestDrwNo });
      } else {
        response.status(500).send("Could not determine the latest draw number.");
      }
    } catch (error) {
      console.error("Error in getLatestDrawNumber:", error);
      response.status(500).send("Error fetching latest draw number.");
    }
  });
});

// HTTP Cloud Function to get a single draw number
exports.getSingleLottoNumber = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    console.log("getSingleLottoNumber function invoked");
    const drwNo = request.query.drwNo;
    if (!drwNo) {
      response.status(400).send("drwNo is required");
      return;
    }

    try {
      const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
      const lottoResponse = await fetch(apiUrl);
      const data = await lottoResponse.json();
      response.json(data);
    } catch (error) {
      console.error("Error fetching single lotto data:", error);
      response.status(500).send("Error fetching single lotto data");
    }
  });
});
