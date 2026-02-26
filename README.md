# Lotto Week 2 Project

This project fetches and displays historical lottery winning numbers.

## 🎱 How to get DETAILED historical data (1 to 1212)

The official API only provides 1st prize information. To get the **full details (1st to 5th prize amounts and winners)** for all 1,212 rounds, follow these steps:

1.  Open [Donghang Lottery (동행복권) Official Site](https://www.dhlottery.co.kr/).
2.  Press `F12` to open Developer Tools and click on the **Console** tab.
3.  Copy and paste the entire script below and press **Enter**. This script will scrape the detailed results page for every round.

```javascript
(async () => {
    const allDetailedData = [];
    const latestRound = 1212; 
    console.log("🚀 Starting detailed data collection... This will take about 10-15 minutes due to server delays.");
    
    for (let i = latestRound; i >= 1; i--) {
        try {
            // Fetch the HTML result page which contains ALL prize info
            const res = await fetch(`https://www.dhlottery.co.kr/gameResult.do?method=byWin&drwNo=${i}`);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract numbers
            const num1 = doc.querySelector('#drwtNo1').textContent;
            const num2 = doc.querySelector('#drwtNo2').textContent;
            const num3 = doc.querySelector('#drwtNo3').textContent;
            const num4 = doc.querySelector('#drwtNo4').textContent;
            const num5 = doc.querySelector('#drwtNo5').textContent;
            const num6 = doc.querySelector('#drwtNo6').textContent;
            const bnus = doc.querySelector('#bnusNo').textContent;
            const date = doc.querySelector('.win_result .desc').textContent.match(/\d{4}년 \d{2}월 \d{2}일/)[0];

            // Extract prize table (1st to 5th)
            const rows = doc.querySelectorAll('.tbl_data_col tbody tr');
            const prizes = [];
            rows.forEach(row => {
                const cols = row.querySelectorAll('td');
                if (cols.length >= 4) {
                    prizes.push({
                        winners: cols[2].textContent.replace(/[^0-9]/g, ''),
                        amount: cols[3].textContent.replace(/[^0-9]/g, '')
                    });
                }
            });

            allDetailedData.push({
                drwNo: i,
                drwNoDate: date.replace('년 ', '-').replace('월 ', '-').replace('일', ''),
                drwtNo1: parseInt(num1),
                drwtNo2: parseInt(num2),
                drwtNo3: parseInt(num3),
                drwtNo4: parseInt(num4),
                drwtNo5: parseInt(num5),
                drwtNo6: parseInt(num6),
                bnusNo: parseInt(bnus),
                prizes: prizes // Array of {winners, amount} for 1st to 5th
            });

        } catch (e) {
            console.error(`Error at round ${i}:`, e);
        }
        
        if (i % 50 === 0) console.log(`✅ Collected up to round ${i}...`);
        // Delay to avoid being blocked
        await new Promise(r => setTimeout(r, 500));
    }
    
    const blob = new Blob([JSON.stringify(allDetailedData, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotto_detailed.json';
    a.click();
    console.log("🎉 SUCCESS! 'lotto_detailed.json' has been downloaded. Replace it in your project folder.");
})();
```

4.  Once downloaded, move `lotto_detailed.json` into this project folder.
5.  Refresh the site to see the detailed prize information in the Search View!

## Features
- **Two Views**: Switch between "History" and "Search" tabs.
- **Detailed Search**: See winners and prize amounts for 1st-5th ranks.
- **12 Items Per Page**: Balance between information density and readability.
- **Authentic Colors**: Lotto ball colors based on official ranges.
