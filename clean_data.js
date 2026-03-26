const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lotto_detailed.json', 'utf8'));

const uniqueMap = new Map();
data.forEach(item => {
    uniqueMap.set(item.drwNo, item);
});

const cleaned = Array.from(uniqueMap.values()).sort((a,b) => b.drwNo - a.drwNo);

fs.writeFileSync('lotto_detailed.json', JSON.stringify(cleaned, null, 2));
console.log(`Cleaned! Total records now: ${cleaned.length}`);
