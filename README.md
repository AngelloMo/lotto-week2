# Lotto Week 2 Project

This project fetches and displays historical lottery winning numbers.

## 🎱 How to get ALL historical data (1 to 1160)

Due to server security policies, fetching all 1,160 rounds automatically from a script can be blocked. Follow these simple steps to get the full dataset yourself:

1.  Open [Donghang Lottery (동행복권) Official Site](https://www.dhlottery.co.kr/).
2.  Press `F12` to open Developer Tools and click on the **Console** tab.
3.  Copy and paste the entire script below and press **Enter**:

```javascript
(async () => {
    const allData = [];
    const latestRound = 1160; 
    console.log("🚀 Starting data collection... This will take about 2-3 minutes.");
    
    for (let i = latestRound; i >= 1; i--) {
        try {
            const res = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
            const data = await res.json();
            if (data.returnValue === 'success') {
                allData.push({
                    drwNo: data.drwNo,
                    drwNoDate: data.drwNoDate,
                    drwtNo1: data.drwtNo1,
                    drwtNo2: data.drwtNo2,
                    drwtNo3: data.drwtNo3,
                    drwtNo4: data.drwtNo4,
                    drwtNo5: data.drwtNo5,
                    drwtNo6: data.drwtNo6,
                    bnusNo: data.bnusNo
                });
            }
        } catch (e) {
            console.error(`Error at round ${i}:`, e);
        }
        if (i % 100 === 0) console.log(`✅ Collected up to round ${i}...`);
        // Small delay to be safe
        await new Promise(r => setTimeout(r, 100));
    }
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotto-data.json';
    a.click();
    console.log("🎉 SUCCESS! 'lotto-data.json' has been downloaded. Copy this file to your project folder.");
})();
```

4.  Once the download is complete, move the `lotto-data.json` file into this project folder (replacing the existing one).
5.  Refresh your application!

## Features
- **10 Items Per Page**: Efficiently browse history.
- **Milestone Search**: Search for any specific draw number.
- **Authentic Colors**: Lotto ball colors based on official number ranges.
- **Reliable Local Source**: Works offline or without API connectivity once data is saved.
