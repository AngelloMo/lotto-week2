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
  if (num <= 10) return ''; // 기본 노랑
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
    lottoNumbersContainer.innerHTML = '<p class="error">결과가 없습니다.</p>';
    return;
  }

  for (const data of numbersToRender) {
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
    lottoNumbersContainer.appendChild(element);
  }
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredNumbers.length / ITEMS_PER_PAGE);
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '이전';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    renderNumbers(currentPage - 1);
    window.scrollTo(0, 0);
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
      renderNumbers(i);
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '다음';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    renderNumbers(currentPage + 1);
    window.scrollTo(0, 0);
  };
  paginationContainer.appendChild(nextBtn);
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    filteredNumbers = [...allLottoNumbers];
  } else {
    filteredNumbers = allLottoNumbers.filter(n => n.drwNo == query);
  }
  renderNumbers(1);
}

searchButton.onclick = handleSearch;
searchInput.onkeyup = (e) => { if(e.key === 'Enter') handleSearch(); };

(async () => {
  try {
    loadingIndicator.style.display = 'block';
    const res = await fetch(LOTTO_DATA_URL);
    allLottoNumbers = await res.json();
    filteredNumbers = [...allLottoNumbers];
    renderNumbers(1);
    loadingIndicator.style.display = 'none';
  } catch (e) {
    loadingIndicator.innerHTML = '데이터 로딩 에러';
  }
})();
