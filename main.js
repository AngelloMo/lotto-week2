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

const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');
const navRecommendBtn = document.getElementById('nav-recommend');
const navAnalysisBtn = document.getElementById('nav-analysis');
const navPerformanceBtn = document.getElementById('nav-performance');

let allLottoNumbers = [];
let currentPage = 1;

// --- View Toggling ---
function switchView(viewName) {
  historyView.style.display = viewName === 'history' ? 'block' : 'none';
  searchView.style.display = viewName === 'search' ? 'block' : 'none';
  recommendView.style.display = viewName === 'recommend' ? 'block' : 'none';
  analysisView.style.display = viewName === 'analysis' ? 'block' : 'none';
  performanceView.style.display = viewName === 'performance' ? 'block' : 'none';

  navHistoryBtn.classList.toggle('active', viewName === 'history');
  navSearchBtn.classList.toggle('active', viewName === 'search');
  navRecommendBtn.classList.toggle('active', viewName === 'recommend');
  navAnalysisBtn.classList.toggle('active', viewName === 'analysis');
  navPerformanceBtn.classList.toggle('active', viewName === 'performance');

  if (viewName === 'history') renderHistory(currentPage);
  if (viewName === 'recommend') renderRecommendations();
}

navHistoryBtn.onclick = () => switchView('history');
navSearchBtn.onclick = () => switchView('search');
navRecommendBtn.onclick = () => switchView('recommend');
navAnalysisBtn.onclick = () => switchView('analysis');
navPerformanceBtn.onclick = () => switchView('performance');

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
  
  let numbersHtml = `
    <div class="numbers">
      <span class="${getBallColorClass(data.drwtNo1)}">${data.drwtNo1}</span>
      <span class="${getBallColorClass(data.drwtNo2)}">${data.drwtNo2}</span>
      <span class="${getBallColorClass(data.drwtNo3)}">${data.drwtNo3}</span>
      <span class="${getBallColorClass(data.drwtNo4)}">${data.drwtNo4}</span>
      <span class="${getBallColorClass(data.drwtNo5)}">${data.drwtNo5}</span>
      <span class="${getBallColorClass(data.drwtNo6)}">${data.drwtNo6}</span>
      <span class="plus-sign">+</span>
      <span class="bonus ${getBallColorClass(data.bnusNo)}">${data.bnusNo}</span>
    </div>
  `;

  let prizeTableHtml = '';
  let remarksHtml = '';

  if (showPrizes && data.prizes && Array.isArray(data.prizes) && data.prizes.length >= 5) {
    prizeTableHtml = `
      <table class="prize-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>당첨자 수</th>
            <th>당첨금액</th>
          </tr>
        </thead>
        <tbody>
          ${data.prizes.map((p, i) => `
            <tr>
              <td>${i + 1}등</td>
              <td class="winners-count">${formatCount(p.winners)}</td>
              <td class="prize-amount">${formatCurrency(p.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    if (data.methods) {
        remarksHtml = `
          <div class="total-info">
            <strong>[비고 - 1등 배출 방식]</strong>
            <div class="method-row"><span>자동</span> <span>${data.methods.auto}건</span></div>
            <div class="method-row"><span>수동</span> <span>${data.methods.manual}건</span></div>
            <div class="method-row"><span>반자동</span> <span>${data.methods.semiAuto}건</span></div>
            <div class="method-row" style="margin-top:8px; border-top: 1px solid #eee; padding-top:5px;">
                <strong>총 판매액</strong> <span>${formatCurrency(data.totSellamnt)}</span>
            </div>
          </div>
        `;
    }
  }

  element.innerHTML = `
    <h3>${data.drwNo}회 당첨결과</h3>
    <p>추첨일: ${data.drwNoDate}</p>
    ${numbersHtml}
    ${prizeTableHtml}
    ${remarksHtml}
  `;
  return element;
}

// --- History View Logic ---
function renderHistory(page) {
  currentPage = page;
  lottoNumbersContainer.innerHTML = '';
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const numbersToRender = allLottoNumbers.slice(start, end);

  numbersToRender.forEach(data => {
    lottoNumbersContainer.appendChild(createLottoCard(data, false));
  });
  
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(allLottoNumbers.length / ITEMS_PER_PAGE);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '이전';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      renderHistory(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  paginationContainer.appendChild(prevBtn);

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      renderHistory(i);
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      renderHistory(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  paginationContainer.appendChild(nextBtn);
}

// --- Search View Logic ---
function populateDropdowns() {
  const options = allLottoNumbers.map(data => `<option value="${data.drwNo}">${data.drwNo}회 (${data.drwNoDate})</option>`).join('');
  searchSelect.innerHTML = '<option value="">회차를 선택하세요</option>' + options;
  performanceSelect.innerHTML = '<option value="">기준 회차 선택</option>' + options;
}

function handleSearch() {
  const selectedRound = searchSelect.value;
  searchResultContainer.innerHTML = '';
  if (!selectedRound) return;

  const data = allLottoNumbers.find(n => n.drwNo == selectedRound);
  if (data) {
    searchResultContainer.appendChild(createLottoCard(data, true));
  }
}

searchButton.onclick = handleSearch;
searchSelect.onchange = handleSearch;

// --- Recommend View Logic ---
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

// --- Analysis View Logic ---
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
        const isBonusMatched = bestMatchDetails && bestMatchDetails.bonusMatched && n === bestRound.bnusNo;
        return `<span class="${getBallColorClass(n)} ${isMatched || isBonusMatched ? 'matched' : ''}">${n}</span>`;
    }).join('') + `</div>`;
    
    let rankHtml = bestRound ? `
        <div class="best-rank-info">
            <h4>🎉 과거 최고 성적: <span class="rank-text">${bestRank}등</span></h4>
            <p class="round-info">제 ${bestRound.drwNo}회차 (${bestRound.drwNoDate})</p>
        </div>` : `<div class="best-rank-info"><h4>😅 성적 없음</h4></div>`;

    resultCard.innerHTML = `<span class="game-label">분석된 추천 번호</span>${ballsHtml}${rankHtml}`;
    analysisContainer.appendChild(resultCard);
}

analysisGenerateBtn.onclick = renderAnalysis;

// --- Performance View Logic ---
function handlePerformance() {
    const selectedRound = performanceSelect.value;
    performanceResultContainer.innerHTML = '';
    if (!selectedRound) return;

    const baseData = allLottoNumbers.find(n => n.drwNo == selectedRound);
    const baseNumbers = [baseData.drwtNo1, baseData.drwtNo2, baseData.drwtNo3, baseData.drwtNo4, baseData.drwtNo5, baseData.drwtNo6];

    const results = [];
    allLottoNumbers.forEach(item => {
        if (item.drwNo == selectedRound) return;
        const res = checkRank(baseNumbers, item);
        if (res.rank > 0) {
            results.push({ 
                drwNo: item.drwNo, 
                date: item.drwNoDate, 
                rank: res.rank,
                winNums: [item.drwtNo1, item.drwtNo2, item.drwtNo3, item.drwtNo4, item.drwtNo5, item.drwtNo6, item.bnusNo]
            });
        }
    });

    results.sort((a, b) => a.rank - b.rank || b.drwNo - a.drwNo);
    const top5 = results.slice(0, 5);

    const card = document.createElement('div');
    card.classList.add('performance-card');
    let baseBallsHtml = `<div class="numbers" style="justify-content:center; gap:8px; margin-bottom:20px;">` + baseNumbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `</div>`;
    
    let listHtml = top5.length > 0 ? top5.map(r => {
        const winBallsHtml = r.winNums.slice(0,6).map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('');
        const bonusBallHtml = `<span class="${getBallColorClass(r.winNums[6])}">${r.winNums[6]}</span>`;
        return `
            <div class="perf-item">
                <div class="perf-top-row">
                    <div><span class="perf-round">제 ${r.drwNo}회</span> <span class="perf-date">${r.date}</span></div>
                    <div class="perf-rank">${r.rank}등</div>
                </div>
                <div class="perf-win-nums">
                    ${winBallsHtml} <span class="plus-sign" style="font-size:1em;">+</span> ${bonusBallHtml}
                </div>
            </div>
        `;
    }).join('') : '<p class="error">상위 성적 기록이 없습니다.</p>';

    card.innerHTML = `
        <h3 style="text-align:center; margin-bottom:15px; font-size:1em;">제 ${selectedRound}회 1등 번호의 타 회차 성적 Top 5</h3>
        ${baseBallsHtml}
        <div class="perf-list">${listHtml}</div>
    `;
    performanceResultContainer.appendChild(card);
}

performanceButton.onclick = handlePerformance;
performanceSelect.onchange = handlePerformance;

// --- Initialization ---
async function loadLottoData() {
  try {
    loadingIndicator.style.display = 'block';
    let response = await fetch(DETAILED_DATA_URL + '?v=' + Date.now());
    if (!response.ok) response = await fetch(BASIC_DATA_URL + '?v=' + Date.now());
    allLottoNumbers = await response.json();
    allLottoNumbers.sort((a, b) => b.drwNo - a.drwNo);
    populateDropdowns();
    renderHistory(1);
    loadingIndicator.style.display = 'none';
  } catch (e) {
    loadingIndicator.innerHTML = `<p class="error">데이터 로드 실패</p>`;
  }
}

loadLottoData();
