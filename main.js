const DETAILED_DATA_URL = '/lotto_detailed.json';
const BASIC_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 12;

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const historyView = document.getElementById('history-view');
const searchView = document.getElementById('search-view');
const recommendView = document.getElementById('recommend-view');
const analysisView = document.getElementById('analysis-view');

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchSelect = document.getElementById('search-select');
const searchButton = document.getElementById('search-button');
const searchResultContainer = document.getElementById('search-result-container');
const recommendContainer = document.getElementById('recommend-container');
const generateBtn = document.getElementById('generate-btn');
const analysisContainer = document.getElementById('analysis-container');
const analysisGenerateBtn = document.getElementById('analysis-generate-btn');

const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');
const navRecommendBtn = document.getElementById('nav-recommend');
const navAnalysisBtn = document.getElementById('nav-analysis');

let allLottoNumbers = [];
let currentPage = 1;

// --- View Toggling ---
function switchView(viewName) {
  historyView.style.display = viewName === 'history' ? 'block' : 'none';
  searchView.style.display = viewName === 'search' ? 'block' : 'none';
  recommendView.style.display = viewName === 'recommend' ? 'block' : 'none';
  analysisView.style.display = viewName === 'analysis' ? 'block' : 'none';

  navHistoryBtn.classList.toggle('active', viewName === 'history');
  navSearchBtn.classList.toggle('active', viewName === 'search');
  navRecommendBtn.classList.toggle('active', viewName === 'recommend');
  navAnalysisBtn.classList.toggle('active', viewName === 'analysis');

  if (viewName === 'history') renderHistory(currentPage);
  if (viewName === 'recommend') renderRecommendations();
  if (viewName === 'analysis') renderAnalysis();
}

navHistoryBtn.onclick = () => switchView('history');
navSearchBtn.onclick = () => switchView('search');
navRecommendBtn.onclick = () => switchView('recommend');
navAnalysisBtn.onclick = () => switchView('analysis');

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
function populateSearchList() {
  searchSelect.innerHTML = '<option value="">회차를 선택하세요</option>';
  allLottoNumbers.forEach(data => {
    const option = document.createElement('option');
    option.value = data.drwNo;
    option.textContent = `${data.drwNo}회 (${data.drwNoDate})`;
    searchSelect.appendChild(option);
  });
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
    
    // Highlight matched numbers in the recommended set
    let ballsHtml = `<div class="numbers">` + myNumbers.map(n => {
        const isMatched = bestMatchDetails && bestMatchDetails.matchedNumbers.includes(n);
        const isBonusMatched = bestMatchDetails && bestMatchDetails.bonusMatched && n === bestRound.bnusNo;
        const extraClass = (isMatched || isBonusMatched) ? 'matched' : '';
        return `<span class="${getBallColorClass(n)} ${extraClass}">${n}</span>`;
    }).join('') + `</div>`;
    
    let rankHtml = '';
    if (bestRound) {
        // Create balls for the historical winning numbers
        const winNums = [bestRound.drwtNo1, bestRound.drwtNo2, bestRound.drwtNo3, bestRound.drwtNo4, bestRound.drwtNo5, bestRound.drwtNo6];
        const winBallsHtml = winNums.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('');
        const bonusBallHtml = `<span class="${getBallColorClass(bestRound.bnusNo)}">${bestRound.bnusNo}</span>`;

        rankHtml = `
            <div class="best-rank-info">
                <h4>🎉 과거 최고 성적: <span class="rank-text">${bestRank}등</span></h4>
                <p class="round-info">제 ${bestRound.drwNo}회차 (${bestRound.drwNoDate})</p>
                <div style="margin-top: 15px;">
                    <p style="font-size: 0.8em; color: #666; margin-bottom: 5px;">당시 당첨 번호:</p>
                    <div class="numbers" style="justify-content: center; transform: scale(0.9);">
                        ${winBallsHtml}
                        <span class="plus-sign">+</span>
                        ${bonusBallHtml}
                    </div>
                </div>
            </div>
        `;
    } else {
        rankHtml = `<div class="best-rank-info"><h4>😅 과거 성적 없음</h4><p>1,212회차 중 5등 이내에 든 적이 없는 번호입니다.</p></div>`;
    }

    resultCard.innerHTML = `
        <span class="game-label">추천 번호 (맞은 번호 강조됨)</span>
        ${ballsHtml}
        ${rankHtml}
    `;
    analysisContainer.appendChild(resultCard);
}

analysisGenerateBtn.onclick = renderAnalysis;

// --- Initialization ---
async function loadLottoData() {
  try {
    loadingIndicator.style.display = 'block';
    let response = await fetch(DETAILED_DATA_URL + '?v=' + Date.now());
    if (!response.ok) response = await fetch(BASIC_DATA_URL + '?v=' + Date.now());
    if (!response.ok) throw new Error('데이터 파일을 불러올 수 없습니다.');
    allLottoNumbers = await response.json();
    allLottoNumbers.sort((a, b) => b.drwNo - a.drwNo);
    populateSearchList();
    renderHistory(1);
    loadingIndicator.style.display = 'none';
  } catch (e) {
    console.error('Initialization error:', e);
    loadingIndicator.innerHTML = `<p class="error">데이터 로드 실패: ${e.message}</p>`;
  }
}

loadLottoData();
