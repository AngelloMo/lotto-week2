const DETAILED_DATA_URL = '/lotto_detailed.json';
const BASIC_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 12;

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const historyView = document.getElementById('history-view');
const searchView = document.getElementById('search-view');
const recommendView = document.getElementById('recommend-view');

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchSelect = document.getElementById('search-select');
const searchButton = document.getElementById('search-button');
const searchResultContainer = document.getElementById('search-result-container');
const recommendContainer = document.getElementById('recommend-container');
const generateBtn = document.getElementById('generate-btn');

const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');
const navRecommendBtn = document.getElementById('nav-recommend');

let allLottoNumbers = [];
let currentPage = 1;

// --- View Toggling ---
function switchView(viewName) {
  historyView.style.display = viewName === 'history' ? 'block' : 'none';
  searchView.style.display = viewName === 'search' ? 'block' : 'none';
  recommendView.style.display = viewName === 'recommend' ? 'block' : 'none';

  navHistoryBtn.classList.toggle('active', viewName === 'history');
  navSearchBtn.classList.toggle('active', viewName === 'search');
  navRecommendBtn.classList.toggle('active', viewName === 'recommend');

  if (viewName === 'history') renderHistory(currentPage);
}

if (navHistoryBtn) navHistoryBtn.onclick = () => switchView('history');
if (navSearchBtn) navSearchBtn.onclick = () => switchView('search');
if (navRecommendBtn) navRecommendBtn.onclick = () => switchView('recommend');

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
            <th>1게임당 당첨금액</th>
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
          <div class="total-info" style="flex-direction: column; align-items: flex-start; gap: 5px;">
            <strong>[비고 - 1등 배출 방식]</strong>
            <span>자동: ${data.methods.auto} / 수동: ${data.methods.manual} / 반자동: ${data.methods.semiAuto}</span>
            <div style="width: 100%; display: flex; justify-content: space-between; margin-top: 5px;">
                <span>총 판매액: ${formatCurrency(data.totSellamnt)}</span>
            </div>
          </div>
        `;
    }
  } else if (showPrizes) {
    prizeTableHtml = '<p class="info-msg">상세 당첨 정보가 없는 회차입니다. 데이터를 확인해 주세요.</p>';
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
  
  if (!selectedRound) {
    searchResultContainer.innerHTML = '<p class="error">회차를 선택해 주세요.</p>';
    return;
  }

  const data = allLottoNumbers.find(n => n.drwNo == selectedRound);
  if (data) {
    searchResultContainer.appendChild(createLottoCard(data, true));
  }
}

if (searchButton) searchButton.onclick = handleSearch;
if (searchSelect) searchSelect.onchange = handleSearch;

// --- Recommend View Logic ---
function generateRandomNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const r = Math.floor(Math.random() * 45) + 1;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }
  return numbers.sort((a, b) => a - b);
}

function renderRecommendations() {
  recommendContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const gameNumbers = generateRandomNumbers();
    const card = document.createElement('div');
    card.classList.add('recommend-card');
    
    let ballsHtml = gameNumbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('');
    
    card.innerHTML = `
      <span class="game-label">조합 ${i}</span>
      <div class="numbers">${ballsHtml}</div>
    `;
    recommendContainer.appendChild(card);
  }
}

if (generateBtn) generateBtn.onclick = renderRecommendations;

// --- Initialization ---
async function loadLottoData() {
  try {
    loadingIndicator.style.display = 'block';
    
    let response = await fetch(DETAILED_DATA_URL);
    if (!response.ok) {
        response = await fetch(BASIC_DATA_URL);
    }
    
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
