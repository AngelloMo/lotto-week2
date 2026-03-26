const fs = require('fs');
const { execSync } = require('child_process');

async function sync() {
    console.log('Downloading latest all.json from smok95 mirror...');
    execSync('curl -s -L "https://smok95.github.io/lotto/results/all.json" -o all_raw.json');
    
    console.log('Transforming data...');
    const rawData = JSON.parse(fs.readFileSync('all_raw.json', 'utf8'));
    
    const transformed = rawData.map(item => {
        const prizes = (item.divisions || []).map(div => ({
            winners: div.winners || 0,
            amount: div.prize || 0
        }));

        while (prizes.length < 5) {
            prizes.push({ winners: 0, amount: 0 });
        }

        // Extract 1st prize methods (Auto, Manual, Semi-auto)
        const methods = item.winners_combination || {};

        return {
            drwNo: item.draw_no,
            drwNoDate: item.date.split('T')[0],
            drwtNo1: item.numbers[0],
            drwtNo2: item.numbers[1],
            drwtNo3: item.numbers[2],
            drwtNo4: item.numbers[3],
            drwtNo5: item.numbers[4],
            drwtNo6: item.numbers[5],
            bnusNo: item.bonus_no,
            totSellamnt: item.total_sales_amount,
            prizes: prizes.slice(0, 5),
            methods: {
                auto: methods.auto || 0,
                manual: methods.manual || 0,
                semiAuto: methods.semi_auto || 0
            }
        };
    });

    // Remove duplicates and sort descending
    const uniqueMap = new Map();
    transformed.forEach(item => {
        uniqueMap.set(item.drwNo, item);
    });
    const cleaned = Array.from(uniqueMap.values()).sort((a,b) => b.drwNo - a.drwNo);

    // Save lotto_detailed.json
    fs.writeFileSync('lotto_detailed.json', JSON.stringify(cleaned, null, 2));
    console.log(`Success! Saved ${cleaned.length} records to lotto_detailed.json`);

    // Save lotto-data.json (subset)
    const basicData = cleaned.map(item => ({
        drwNo: item.drwNo,
        drwNoDate: item.drwNoDate,
        drwtNo1: item.drwtNo1,
        drwtNo2: item.drwtNo2,
        drwtNo3: item.drwtNo3,
        drwtNo4: item.drwtNo4,
        drwtNo5: item.drwtNo5,
        drwtNo6: item.drwtNo6,
        bnusNo: item.bnusNo
    }));
    fs.writeFileSync('lotto-data.json', JSON.stringify(basicData, null, 2));
    console.log(`Success! Saved ${basicData.length} records to lotto-data.json`);

    // Clean up
    fs.unlinkSync('all_raw.json');
}

sync().catch(console.error);
