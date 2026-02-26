const DETAILED_DATA_URL = '/lotto_detailed.json';
const BASIC_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 12;

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const historyView = document.getElementById('history-view');
const searchView = document.getElementById('search-view');
const recommendView = document.getElementById('recommend-view');
const analysisView = document.getElementById('analysis-view');
const performanceView = document.getElementById('performance-view');
const statsView = document.getElementById('stats-view');
const collisionView = document.getElementById('collision-view');

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchSelect = document.getElementById('search-select');
const searchButton = document.getElementById('search-button');
const searchResultContainer = document.getElementById('search-result-container');
const recommendContainer = document.getElementById('recommend-container');
const generateBtn = document.getElementById('generate-btn');
const analysisContainer = document.getElementById('analysis-container');
const analysisGenerateBtn = document.getElementById('analysis-generate-btn');
const performanceSelect = document.getElementById('performance-select');
const performanceButton = document.getElementById('performance-button');
const performanceResultContainer = document.getElementById('performance-result-container');
const statsContainer = document.getElementById('stats-container');
const collisionContainer = document.getElementById('collision-container');

const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');
const navRecommendBtn = document.getElementById('nav-recommend');
const navAnalysisBtn = document.getElementById('nav-analysis');
const navPerformanceBtn = document.getElementById('nav-performance');
const navStatsBtn = document.getElementById('nav-stats');
const navCollisionBtn = document.getElementById('nav-collision');

let allLottoNumbers = [];
let currentPage = 1;

// --- View Toggling ---
function switchView(viewName) {
  [historyView, searchView, recommendView, analysisView, performanceView, statsView, collisionView].forEach(v => v.style.display = 'none');
  const viewMap = { history: historyView, search: searchView, recommend: recommendView, analysis: analysisView, performance: performanceView, stats: statsView, collision: collisionView };
  if (viewMap[viewName]) viewMap[viewName].style.display = 'block';

  [navHistoryBtn, navSearchBtn, navRecommendBtn, navAnalysisBtn, navPerformanceBtn, navStatsBtn, navCollisionBtn].forEach(b => b.classList.remove('active'));
  const btnMap = { history: navHistoryBtn, search: navSearchBtn, recommend: navRecommendBtn, analysis: navAnalysisBtn, performance: navPerformanceBtn, stats: navStatsBtn, collision: navCollisionBtn };
  if (btnMap[viewName]) btnMap[viewName].classList.add('active');

  if (viewName === 'history') renderHistory(currentPage);
  if (viewName === 'stats') renderStats();
  if (viewName === 'collision') renderCollisions();
}

navHistoryBtn.onclick = () => switchView('history');
navSearchBtn.onclick = () => switchView('search');
navRecommendBtn.onclick = () => switchView('recommend');
navAnalysisBtn.onclick = () => switchView('analysis');
navPerformanceBtn.onclick = () => switchView('performance');
navStatsBtn.onclick = () => switchView('stats');
navCollisionBtn.onclick = () => switchView('collision');

// --- Helper Functions ---
function getBallColorClass(num) {
  if (num <= 10) return ''; // Yellow
  if (num <= 20) return 'num-blue';
  if (num <= 30) return 'num-red';
  if (num <= 40) return 'num-gray';
  return 'num-green';
}

function formatCurrency(amount) {
  if (!amount) return '0원';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

function formatCount(count) {
  if (!count) return '0명';
  return new Intl.NumberFormat('ko-KR').format(count) + '명';
}

function generateRandomNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const r = Math.floor(Math.random() * 45) + 1;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }
  return numbers.sort((a, b) => a - b);
}

function checkRank(myNumbers, historyItem) {
    const winNumbers = [historyItem.drwtNo1, historyItem.drwtNo2, historyItem.drwtNo3, historyItem.drwtNo4, historyItem.drwtNo5, historyItem.drwtNo6];
    const matchedNumbers = myNumbers.filter(n => winNumbers.includes(n));
    const matchCount = matchedNumbers.length;
    const hasBonus = myNumbers.includes(historyItem.bnusNo);

    let rank = 0;
    if (matchCount === 6) rank = 1;
    else if (matchCount === 5 && hasBonus) rank = 2;
    else if (matchCount === 5) rank = 3;
    else if (matchCount === 4) rank = 4;
    else if (matchCount === 3) rank = 5;

    return { rank, matchedNumbers, bonusMatched: hasBonus && rank === 2 };
}

function createLottoCard(data, showPrizes = false) {
  const element = document.createElement('div');
  element.classList.add('lotto-round');
  let numbersHtml = `<div class="numbers">` + [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6].map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `<span class="plus-sign">+</span><span class="bonus ${getBallColorClass(data.bnusNo)}">${data.bnusNo}</span></div>`;
  let prizeTableHtml = '';
  let remarksHtml = '';
  if (showPrizes && data.prizes && data.prizes.length >= 5) {
    prizeTableHtml = `<table class="prize-table"><thead><tr><th>순위</th><th>당첨자 수</th><th>당첨금액</th></tr></thead><tbody>` + data.prizes.map((p, i) => `<tr><td>${i + 1}등</td><td class="winners-count">${formatCount(p.winners)}</td><td class="prize-amount">${formatCurrency(p.amount)}</td></tr>`).join('') + `</tbody></table>`;
    if (data.methods) {
        remarksHtml = `<div class="total-info"><strong>[비고 - 1등 배출 방식]</strong><div class="method-row"><span>자동</span> <span>${data.methods.auto}건</span></div><div class="method-row"><span>수동</span> <span>${data.methods.manual}건</span></div><div class="method-row"><span>반자동</span> <span>${data.methods.semiAuto}건</span></div><div class="method-row" style="margin-top:8px; border-top: 1px solid #eee; padding-top:5px;"><strong>총 판매액</strong> <span>${formatCurrency(data.totSellamnt)}</span></div></div>`;
    }
  }
  element.innerHTML = `<h3>${data.drwNo}회 당첨결과</h3><p>추첨일: ${data.drwNoDate}</p>${numbersHtml}${prizeTableHtml}${remarksHtml}`;
  return element;
}

// --- History View ---
function renderHistory(page) {
  currentPage = page;
  lottoNumbersContainer.innerHTML = '';
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  allLottoNumbers.slice(start, end).forEach(data => lottoNumbersContainer.appendChild(createLottoCard(data, false)));
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(allLottoNumbers.length / ITEMS_PER_PAGE);
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '이전';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { if (currentPage > 1) { renderHistory(currentPage - 1); window.scrollTo(0, 0); } };
  paginationContainer.appendChild(prevBtn);
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => { renderHistory(i); window.scrollTo(0, 0); };
    paginationContainer.appendChild(btn);
  }
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { if (currentPage < totalPages) { renderHistory(currentPage + 1); window.scrollTo(0, 0); } };
  paginationContainer.appendChild(nextBtn);
}

// --- Dropdowns ---
function populateDropdowns() {
  const options = allLottoNumbers.map(data => `<option value="${data.drwNo}">${data.drwNo}회 (${data.drwNoDate})</option>`).join('');
  searchSelect.innerHTML = '<option value="">회차를 선택하세요</option>' + options;
  performanceSelect.innerHTML = '<option value="">기준 회차 선택</option>' + options;
}

// --- Search View ---
function handleSearch() {
  const selectedRound = searchSelect.value;
  searchResultContainer.innerHTML = '';
  if (!selectedRound) return;
  const data = allLottoNumbers.find(n => n.drwNo == selectedRound);
  if (data) searchResultContainer.appendChild(createLottoCard(data, true));
}
searchButton.onclick = handleSearch;
searchSelect.onchange = handleSearch;

// --- Recommend View ---
function renderRecommendations() {
  recommendContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const gameNumbers = generateRandomNumbers();
    const card = document.createElement('div');
    card.classList.add('recommend-card');
    let ballsHtml = `<div class="numbers">` + gameNumbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `</div>`;
    card.innerHTML = `<span class="game-label">조합 ${i}</span>${ballsHtml}`;
    recommendContainer.appendChild(card);
  }
}
generateBtn.onclick = renderRecommendations;

// --- Analysis View ---
function renderAnalysis() {
    const myNumbers = generateRandomNumbers();
    analysisContainer.innerHTML = '';
    let bestRank = 99;
    let bestRound = null;
    let bestMatchDetails = null;
    allLottoNumbers.forEach(item => {
        const result = checkRank(myNumbers, item);
        if (result.rank > 0 && result.rank < bestRank) {
            bestRank = result.rank;
            bestRound = item;
            bestMatchDetails = result;
        }
    });
    const resultCard = document.createElement('div');
    resultCard.classList.add('analysis-result');
    let ballsHtml = `<div class="numbers">` + myNumbers.map(n => {
        const isMatched = bestMatchDetails && bestMatchDetails.matchedNumbers.includes(n);
        const isBonusMatched = bestMatchDetails && (bestMatchDetails.bonusMatched || (bestMatchDetails.rank === 2 && n === bestRound.bnusNo));
        return `<span class="${getBallColorClass(n)} ${isMatched || isBonusMatched ? 'matched' : ''}">${n}</span>`;
    }).join('') + `</div>`;
    let rankHtml = bestRound ? `<div class="best-rank-info"><h4>🎉 과거 최고 성적: <span class="rank-text">${bestRank}등</span></h4><p class="round-info">제 ${bestRound.drwNo}회차 (${bestRound.drwNoDate})</p></div>` : `<div class="best-rank-info"><h4>😅 성적 없음</h4></div>`;
    resultCard.innerHTML = `<span class="game-label">분석된 추천 번호</span>${ballsHtml}${rankHtml}`;
    analysisContainer.appendChild(resultCard);
}
analysisGenerateBtn.onclick = renderAnalysis;

// --- Performance View ---
function handlePerformance() {
    const selectedRound = performanceSelect.value;
    performanceResultContainer.innerHTML = '';
    if (!selectedRound) return;
    const baseData = allLottoNumbers.find(n => n.drwNo == selectedRound);
    const baseNumbers = [baseData.drwtNo1, baseData.drwtNo2, baseData.drwtNo3, baseData.drwtNo4, baseData.drwtNo5, baseData.drwtNo6];
    const drawDate = new Date(baseData.drwNoDate.replace(/\./g, '-'));
    const threeMonthsAgo = new Date(drawDate);
    threeMonthsAgo.setMonth(drawDate.getMonth() - 3);
    const results = [];
    allLottoNumbers.forEach(item => {
        const itemDate = new Date(item.drwNoDate.replace(/\./g, '-'));
        if (itemDate >= threeMonthsAgo && itemDate < drawDate) {
            const res = checkRank(baseNumbers, item);
            if (res.rank > 0) results.push({ drwNo: item.drwNo, date: item.drwNoDate, rank: res.rank, winNums: [item.drwtNo1, item.drwtNo2, item.drwtNo3, item.drwtNo4, item.drwtNo5, item.drwtNo6, item.bnusNo] });
        }
    });
    results.sort((a, b) => a.rank - b.rank || b.drwNo - a.drwNo);
    const top5 = results.slice(0, 5);
    const card = document.createElement('div');
    card.classList.add('performance-card');
    let baseBallsHtml = `<div class="numbers" style="justify-content:center; gap:8px; margin-bottom:20px;">` + baseNumbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `</div>`;
    let listHtml = top5.length > 0 ? top5.map(r => {
        const winBallsHtml = r.winNums.slice(0,6).map(n => `<span class="${getBallColorClass(n)} ${baseNumbers.includes(n) ? 'matched' : ''}">${n}</span>`).join('');
        const isBonusMatched = baseNumbers.includes(r.winNums[6]);
        const bonusBallHtml = `<span class="${getBallColorClass(r.winNums[6])} ${isBonusMatched ? 'matched' : ''}">${r.winNums[6]}</span>`;
        return `<div class="perf-item"><div class="perf-top-row"><div><span class="perf-round">제 ${r.drwNo}회</span> <span class="perf-date">${r.date}</span></div><div class="perf-rank">${r.rank}등</div></div><div class="numbers" style="justify-content:center; gap:4px; transform:scale(0.85); margin:5px 0;">${winBallsHtml} <span class="plus-sign" style="font-size:1em;">+</span> ${bonusBallHtml}</div></div>`;
    }).join('') : `<p class="info-msg" style="text-align:center;">이전 3개월 동안 당첨 이력이 없습니다.</p>`;
    card.innerHTML = `<h3 style="text-align:center; font-size:1em;">제 ${selectedRound}회 번호의 이전 3개월 최고 성적</h3>${baseBallsHtml}${listHtml}`;
    performanceResultContainer.appendChild(card);
}
performanceButton.onclick = handlePerformance;
performanceSelect.onchange = handlePerformance;

// --- Stats View ---
function renderStats() {
    statsContainer.innerHTML = '<p style="text-align:center;">분석 중입니다... 잠시만 기다려주세요.</p>';
    setTimeout(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 0: 0 };
        const dataSorted = [...allLottoNumbers].sort((a, b) => a.drwNo - b.drwNo);
        const startIndex = dataSorted.findIndex(d => d.drwNo >= 500);
        if (startIndex === -1) return;
        for (let i = startIndex; i < dataSorted.length; i++) {
            const current = dataSorted[i];
            const myNumbers = [current.drwtNo1, current.drwtNo2, current.drwtNo3, current.drwtNo4, current.drwtNo5, current.drwtNo6];
            let bestRank = 99;
            for (let j = 0; j < i; j++) {
                const prev = dataSorted[j];
                const res = checkRank(myNumbers, prev);
                if (res.rank > 0 && res.rank < bestRank) bestRank = res.rank;
            }
            counts[bestRank === 99 ? 0 : bestRank]++;
        }
        const total = dataSorted.length - startIndex;
        const maxCount = Math.max(...Object.values(counts));
        let html = `<div class="stats-card"><h3>성적 분포 결과 (대상: ${total}개 회차)</h3><div class="histogram">`;
        [1, 2, 3, 4, 5, 0].forEach(rank => {
            const label = rank === 0 ? '꽝' : `${rank}등`;
            const count = counts[rank];
            const percent = ((count / total) * 100).toFixed(1);
            const barWidth = ((count / maxCount) * 100).toFixed(1);
            html += `<div class="hist-row"><div class="hist-label">${label}</div><div class="hist-bar-container"><div class="hist-bar" style="width: ${barWidth}%"></div><div class="hist-value">${count}건 (${percent}%)</div></div></div>`;
        });
        html += '</div></div>';
        statsContainer.innerHTML = html;
    }, 100);
}

// --- Collision View Logic ---
function renderCollisions() {
    collisionContainer.innerHTML = '<p style="text-align:center;">중복 데이터를 분석하고 있습니다... (약 5-10초 소요)</p>';
    setTimeout(() => {
        const collisions = [];
        const dataSorted = [...allLottoNumbers].sort((a, b) => a.drwNo - b.drwNo);
        
        for (let i = 0; i < dataSorted.length; i++) {
            const current = dataSorted[i];
            const myNumbers = [current.drwtNo1, current.drwtNo2, current.drwtNo3, current.drwtNo4, current.drwtNo5, current.drwtNo6];
            
            for (let j = 0; j < i; j++) {
                const prev = dataSorted[j];
                const res = checkRank(myNumbers, prev);
                if (res.rank === 1 || res.rank === 2 || res.rank === 3) {
                    collisions.push({ roundA: prev, roundB: current, rank: res.rank, matched: res.matchedNumbers });
                }
            }
        }

        collisions.sort((a, b) => a.rank - b.rank || b.roundB.drwNo - a.roundB.drwNo);

        if (collisions.length === 0) {
            collisionContainer.innerHTML = '<p class="info-msg">역대 3등 이내 중복 당첨 사례가 없습니다.</p>';
            return;
        }

        let html = '';
        collisions.forEach(c => {
            const ballsA = [c.roundA.drwtNo1, c.roundA.drwtNo2, c.roundA.drwtNo3, c.roundA.drwtNo4, c.roundA.drwtNo5, c.roundA.drwtNo6].map(n => `<span class="${getBallColorClass(n)} ${c.matched.includes(n) ? 'matched' : ''}">${n}</span>`).join('');
            const ballsB = [c.roundB.drwtNo1, c.roundB.drwtNo2, c.roundB.drwtNo3, c.roundB.drwtNo4, c.roundB.drwtNo5, c.roundB.drwtNo6].map(n => `<span class="${getBallColorClass(n)} ${c.matched.includes(n) ? 'matched' : ''}">${n}</span>`).join('');
            
            html += `
                <div class="collision-card">
                    <div class="collision-title"><span>과거 ${c.rank}등 당첨 사례</span> <span class="perf-rank">${c.rank}등</span></div>
                    <div class="collision-item">
                        <div class="round-info">먼저 나온 회차: 제 ${c.roundA.drwNo}회 (${c.roundA.drwNoDate})</div>
                        <div class="numbers" style="transform:scale(0.85); margin:5px 0;">${ballsA}</div>
                    </div>
                    <div class="collision-item">
                        <div class="round-info">나중에 나온 회차: 제 ${c.roundB.drwNo}회 (${c.roundB.drwNoDate})</div>
                        <div class="numbers" style="transform:scale(0.85); margin:5px 0;">${ballsB}</div>
                    </div>
                </div>
            `;
        });
        collisionContainer.innerHTML = html;
    }, 100);
}

// --- Initialization ---
async function loadLottoData() {
  try {
    loadingIndicator.style.display = 'block';
    let response = await fetch(DETAILED_DATA_URL + '?v=' + Date.now());
    if (!response.ok) response = await fetch(BASIC_DATA_URL + '?v=' + Date.now());
    if (!response.ok) throw new Error('데이터 파일을 불러올 수 없습니다.');
    allLottoNumbers = await response.json();
    allLottoNumbers.sort((a, b) => b.drwNo - a.drwNo);
    populateDropdowns();
    renderHistory(1);
    loadingIndicator.style.display = 'none';
  } catch (e) {
    console.error('Initialization error:', e);
    loadingIndicator.innerHTML = `<p class="error">데이터 로드 실패</p>`;
  }
}

loadLottoData();
