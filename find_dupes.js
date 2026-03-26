const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lotto_detailed.json', 'utf8'));

const map = new Map();
const duplicates = [];

data.forEach(item => {
    const nums = [item.drwtNo1, item.drwtNo2, item.drwtNo3, item.drwtNo4, item.drwtNo5, item.drwtNo6].sort((a,b)=>a-b).join(',');
    if (map.has(nums)) {
        duplicates.push({
            numbers: nums,
            current: item.drwNo,
            previous: map.get(nums)
        });
    } else {
        map.set(nums, item.drwNo);
    }
});

console.log(JSON.stringify(duplicates, null, 2));
