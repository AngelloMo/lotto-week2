const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lotto_detailed.json', 'utf8'));
const counts = {};
const dupes = [];
data.forEach(item => {
    counts[item.drwNo] = (counts[item.drwNo] || 0) + 1;
});
for (const drwNo in counts) {
    if (counts[drwNo] > 1) dupes.push({ drwNo, count: counts[drwNo] });
}
console.log(JSON.stringify(dupes));
