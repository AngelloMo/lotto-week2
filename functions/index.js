const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });

// Function to find the latest draw number
async function findLatestDrawNumber() {
  let drwNo = 1200; // Start searching from a reasonably high number
  let lastSuccessfulDrwNo = 0;

  // Go up from the starting drwNo to find the latest existing one
  // Limiting the loop to prevent excessive calls in case of unexpected API behavior
  for (let i = 0; i < 200; i++) { // Check up to 200 draws after the starting point
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    try {
      const lottoResponse = await fetch(apiUrl);
      const data = await lottoResponse.json();

      if (data && data.returnValue === 'success') {
        lastSuccessfulDrwNo = drwNo;
        drwNo++;
      } else {
        // If we get an error or non-success, the previous one was the latest
        break;
      }
    } catch (error) {
      // Log and break if there's a network error or JSON parsing error
      console.error(`Error fetching drwNo ${drwNo} in findLatestDrawNumber:`, error);
      break;
    }
  }
  return lastSuccessfulDrwNo;
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
