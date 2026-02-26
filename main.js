const LOTTO_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 10;

const loadingIndicator = document.getElementById('loading-indicator');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

let allLottoNumbers = [];
let filteredNumbers = [];
let currentPage = 1;

function getBallColorClass(num) {
  if (num <= 10) return ''; // Yellow (default)
  if (num <= 20) return 'num-blue';
  if (num <= 30) return 'num-red';
  if (num <= 40) return 'num-gray';
  return 'num-green';
}

function renderNumbers(page) {
  currentPage = page;
  lottoNumbersContainer.innerHTML = '';
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const numbersToRender = filteredNumbers.slice(start, end);

  if (numbersToRender.length === 0) {
    lottoNumbersContainer.innerHTML = '<p class="error">검색 결과가 없습니다.</p>';
    return;
  }

  for (const numberData of numbersToRender) {
    const element = document.createElement('div');
    element.classList.add('lotto-round');
    element.innerHTML = `
      <h3>${numberData.drwNo}회</h3>
      <p>날짜: ${numberData.drwNoDate}</p>
      <div class="numbers">
        <span class="${getBallColorClass(numberData.drwtNo1)}">${numberData.drwtNo1}</span>
        <span class="${getBallColorClass(numberData.drwtNo2)}">${numberData.drwtNo2}</span>
        <span class="${getBallColorClass(numberData.drwtNo3)}">${numberData.drwtNo3}</span>
        <span class="${getBallColorClass(numberData.drwtNo4)}">${numberData.drwtNo4}</span>
        <span class="${getBallColorClass(numberData.drwtNo5)}">${numberData.drwtNo5}</span>
        <span class="${getBallColorClass(numberData.drwtNo6)}">${numberData.drwtNo6}</span>
        <span class="bonus ${getBallColorClass(numberData.bnusNo)}">+ ${numberData.bnusNo}</span>
      </div>
    `;
    lottoNumbersContainer.appendChild(element);
  }
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredNumbers.length / ITEMS_PER_PAGE);
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';
  if (totalPages <= 0) return;

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '이전';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      renderNumbers(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  paginationContainer.appendChild(prevBtn);

  // Page numbers (limited range for many pages)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    if (i === currentPage) button.classList.add('active');
    button.onclick = () => {
      renderNumbers(i);
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(button);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      renderNumbers(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  paginationContainer.appendChild(nextBtn);
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query === '') {
    filteredNumbers = [...allLottoNumbers];
  } else {
    const drawNo = parseInt(query);
    filteredNumbers = allLottoNumbers.filter(item => item.drwNo === drawNo);
  }
  renderNumbers(1);
}

searchButton.onclick = handleSearch;
searchInput.onkeyup = (e) => {
  if (e.key === 'Enter') handleSearch();
};

(async () => {
  try {
    loadingIndicator.style.display = 'block';
    const response = await fetch(LOTTO_DATA_URL);
    if (!response.ok) throw new Error('데이터 로딩 실패');
    
    allLottoNumbers = await response.json();
    filteredNumbers = [...allLottoNumbers];

    renderNumbers(1);

    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.style.visibility = 'visible';
    paginationContainer.style.visibility = 'visible';
  } catch (error) {
    console.error('Error:', error);
    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.innerHTML = `<p class="error">데이터를 불러오는 데 실패했습니다. (${error.message})</p>`;
    lottoNumbersContainer.style.visibility = 'visible';
  }
})();
