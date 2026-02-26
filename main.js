const LOTTO_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 10;

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const historyView = document.getElementById('history-view');
const searchView = document.getElementById('search-view');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchSelect = document.getElementById('search-select');
const searchButton = document.getElementById('search-button');
const searchResultContainer = document.getElementById('search-result-container');
const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');

let allLottoNumbers = [];
let currentPage = 1;

// --- View Toggling ---
function switchView(viewName) {
  if (viewName === 'history') {
    historyView.style.display = 'block';
    searchView.style.display = 'none';
    navHistoryBtn.classList.add('active');
    navSearchBtn.classList.remove('active');
    renderHistory(currentPage);
  } else {
    historyView.style.display = 'none';
    searchView.style.display = 'block';
    navHistoryBtn.classList.remove('active');
    navSearchBtn.classList.add('active');
  }
}

navHistoryBtn.onclick = () => switchView('history');
navSearchBtn.onclick = () => switchView('search');

// --- Helper Functions ---
function getBallColorClass(num) {
  if (num <= 10) return ''; // Yellow
  if (num <= 20) return 'num-blue';
  if (num <= 30) return 'num-red';
  if (num <= 40) return 'num-gray';
  return 'num-green';
}

function createLottoCard(data) {
  const element = document.createElement('div');
  element.classList.add('lotto-round');
  element.innerHTML = `
    <h3>${data.drwNo}회 당첨결과</h3>
    <p>추첨일: ${data.drwNoDate}</p>
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
    lottoNumbersContainer.appendChild(createLottoCard(data));
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
    searchResultContainer.appendChild(createLottoCard(data));
  }
}

searchButton.onclick = handleSearch;
searchSelect.onchange = handleSearch;

// --- Initialization ---
(async () => {
  try {
    loadingIndicator.style.display = 'block';
    const res = await fetch(LOTTO_DATA_URL);
    if (!res.ok) throw new Error('데이터 파일을 불러올 수 없습니다.');
    
    allLottoNumbers = await res.json();
    allLottoNumbers.sort((a, b) => b.drwNo - a.drwNo);
    
    populateSearchList();
    renderHistory(1);
    
    loadingIndicator.style.display = 'none';
  } catch (e) {
    console.error(e);
    loadingIndicator.innerHTML = `<p class="error">오류: ${e.message}</p>`;
  }
})();
