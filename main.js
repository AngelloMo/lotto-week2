const LOTTO_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 30;

const loadingIndicator = document.getElementById('loading-indicator');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');

let allLottoNumbers = [];
let currentPage = 1;

function renderNumbers(page) {
  currentPage = page;
  lottoNumbersContainer.innerHTML = '';
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const numbersToRender = allLottoNumbers.slice(start, end);

  for (const numberData of numbersToRender) {
    const element = document.createElement('div');
    element.classList.add('lotto-round');
    element.innerHTML = `
      <h3>${numberData.drwNo}회</h3>
      <p>날짜: ${numberData.drwNoDate}</p>
      <div class="numbers">
        <span>${numberData.drwtNo1}</span>
        <span>${numberData.drwtNo2}</span>
        <span>${numberData.drwtNo3}</span>
        <span>${numberData.drwtNo4}</span>
        <span>${numberData.drwtNo5}</span>
        <span>${numberData.drwtNo6}</span>
        <span class="bonus">+ ${numberData.bnusNo}</span>
      </div>
    `;
    lottoNumbersContainer.appendChild(element);
  }
  updatePagination();
}

function updatePagination() {
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      renderNumbers(i);
      window.scrollTo(0, 0);
    });
    paginationContainer.appendChild(button);
  }
}

(async () => {
  try {
    loadingIndicator.style.display = 'block';

    console.log('Fetching local lotto data...');
    const response = await fetch(LOTTO_DATA_URL);
    
    if (!response.ok) {
        throw new Error(`데이터 파일을 찾을 수 없습니다. (Status: ${response.status})`);
    }
    
    allLottoNumbers = await response.json();
    console.log('Data loaded:', allLottoNumbers.length, 'records');

    if (!Array.isArray(allLottoNumbers) || allLottoNumbers.length === 0) {
        throw new Error("데이터가 비어 있습니다.");
    }

    const totalPages = Math.ceil(allLottoNumbers.length / ITEMS_PER_PAGE);
    renderPagination(totalPages);
    renderNumbers(1);

    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.style.visibility = 'visible';
    paginationContainer.style.visibility = 'visible';

  } catch (error) {
    console.error('Error:', error);
    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.innerHTML = `<p class="error">데이터를 불러오는 데 실패했습니다. <br>(${error.message})</p>`;
    lottoNumbersContainer.style.visibility = 'visible';
  }
})();
