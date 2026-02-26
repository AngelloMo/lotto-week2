const GET_LATEST_DRAW_URL = '/getLatestDrawNumber';
const GET_SINGLE_DRAW_URL = '/getSingleLottoNumber';
const ITEMS_PER_PAGE = 30;

const loadingIndicator = document.getElementById('loading-indicator');
const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');

let allLottoNumbers = [];
let currentPage = 1;

async function getSingleLottoNumber(drwNo) {
  try {
    const response = await fetch(`${GET_SINGLE_DRAW_URL}?drwNo=${drwNo}`);
    console.log(`Fetching single draw data from: ${GET_SINGLE_DRAW_URL}?drwNo=${drwNo}, Response status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      if (data.returnValue === 'success') {
        return data;
      }
    }
  } catch (error) {
    console.error(`Error fetching data for round ${drwNo}:`, error);
  }
  return null;
}

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
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      renderNumbers(i);
    });
    paginationContainer.appendChild(button);
  }
}

(async () => {
  try {
    console.log('Fetching latest draw number...');
    loadingIndicator.style.display = 'block';

    const latestDrawResponse = await fetch(GET_LATEST_DRAW_URL);
    console.log(`Fetching latest draw from: ${GET_LATEST_DRAW_URL}, Response status: ${latestDrawResponse.status}`);
    if (!latestDrawResponse.ok) {
        throw new Error(`HTTP error! status: ${latestDrawResponse.status} from ${GET_LATEST_DRAW_URL}`);
    }
    const { latestDrwNo } = await latestDrawResponse.json();
    console.log('Latest draw number:', latestDrwNo);

    if (latestDrwNo < 1) {
        throw new Error("Could not determine the latest draw number.");
    }

    // Now fetch all numbers individually
    console.log('Fetching all lottery data individually...');
    const fetchPromises = [];
    for (let i = latestDrwNo; i >= 1; i--) {
      fetchPromises.push(getSingleLottoNumber(i));
    }
    const results = await Promise.all(fetchPromises);
    allLottoNumbers = results.filter(Boolean); // Filter out any null responses

    console.log('All lotto numbers fetched:', allLottoNumbers);

    if (!Array.isArray(allLottoNumbers) || allLottoNumbers.length === 0) {
        throw new Error("No lottery data received.");
    }

    const totalPages = Math.ceil(allLottoNumbers.length / ITEMS_PER_PAGE);
    renderPagination(totalPages);
    renderNumbers(1);

    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.style.visibility = 'visible';
    paginationContainer.style.visibility = 'visible';

  } catch (error) {
    console.error('Error fetching lottery data:', error);
    loadingIndicator.style.display = 'none';
    lottoNumbersContainer.innerHTML = `<p class="error">데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요. (${error.message})</p>`;
    lottoNumbersContainer.style.visibility = 'visible';
  }
})();