const DETAILED_DATA_URL = '/lotto_detailed.json';
const BASIC_DATA_URL = '/lotto-data.json';
const ITEMS_PER_PAGE = 12;

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const historyView = document.getElementById('history-view');
const searchView = document.getElementById('search-view');
const recommendView = document.getElementById('recommend-view');
const analysisView = document.getElementById('analysis-view');
const aiProView = document.getElementById('ai-pro-view');
const manualCheckView = document.getElementById('manual-check-view');
const photoView = document.getElementById('photo-view');
const simulationView = document.getElementById('simulation-view');
const performanceView = document.getElementById('performance-view');
const statsView = document.getElementById('stats-view');
const statsRecentView = document.getElementById('stats-recent-view');
const collisionView = document.getElementById('collision-view');
const collisionStatsView = document.getElementById('collision-stats-view');
const aiVsRandomView = document.getElementById('ai-vs-random-view');

const lottoNumbersContainer = document.getElementById('lotto-numbers-container');
const paginationContainer = document.getElementById('pagination-container');
const searchSelect = document.getElementById('search-select');
const searchButton = document.getElementById('search-button');
const searchResultContainer = document.getElementById('search-result-container');
const recommendContainer = document.getElementById('recommend-container');
const generateBtn = document.getElementById('generate-btn');
const analysisContainer = document.getElementById('analysis-container');
const analysisGenerateBtn = document.getElementById('analysis-generate-btn');
const aiProContainer = document.getElementById('ai-pro-container');
const aiProGenerateBtn = document.getElementById('ai-pro-generate-btn');
const manualSelectionGrid = document.getElementById('manual-selection-grid');
const selectedNumbersDisplay = document.getElementById('selected-numbers-display');
const manualAnalyzeBtn = document.getElementById('manual-analyze-btn');
const manualResetBtn = document.getElementById('manual-reset-btn');
const manualCheckResultContainer = document.getElementById('manual-check-result-container');
const simulationRunBtn = document.getElementById('simulation-run-btn');
const simulationResultContainer = document.getElementById('simulation-result-container');
const performanceSelect = document.getElementById('performance-select');
const performanceButton = document.getElementById('performance-button');
const performanceResultContainer = document.getElementById('performance-result-container');
const statsContainer = document.getElementById('stats-container');
const statsRecentContainer = document.getElementById('stats-recent-container');
const collisionContainer = document.getElementById('collision-container');
const collisionStatsContainer = document.getElementById('collision-stats-container');
const aiVsRandomRunBtn = document.getElementById('ai-vs-random-run-btn');
const aiVsRandomResultContainer = document.getElementById('ai-vs-random-result-container');
const recentComparisonView = document.getElementById('recent-comparison-view');
const recentComparisonRunBtn = document.getElementById('recent-comparison-run-btn');
const recentComparisonResultContainer = document.getElementById('recent-comparison-result-container');

// Photo Analysis Elements
const photoInput = document.getElementById('photo-input');
const uploadArea = document.getElementById('upload-area');
const photoPreview = document.getElementById('photo-preview');
const photoAnalyzeBtn = document.getElementById('photo-analyze-btn');
const ocrProgressContainer = document.getElementById('ocr-progress-container');
const ocrProgressBar = document.getElementById('ocr-progress-bar');
const ocrStatusText = document.getElementById('ocr-status-text');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const photoResultsContainer = document.getElementById('photo-results-container');

const navHistoryBtn = document.getElementById('nav-history');
const navSearchBtn = document.getElementById('nav-search');
const navRecommendBtn = document.getElementById('nav-recommend');
const navAnalysisBtn = document.getElementById('nav-analysis');
const navAiProBtn = document.getElementById('nav-ai-pro');
const navManualCheckBtn = document.getElementById('nav-manual-check');
const navPhotoBtn = document.getElementById('nav-photo');
const navSimulationBtn = document.getElementById('nav-simulation');
const navPerformanceBtn = document.getElementById('nav-performance');
const navStatsBtn = document.getElementById('nav-stats');
const navStatsRecentBtn = document.getElementById('nav-stats-recent');
const navCollisionBtn = document.getElementById('nav-collision');
const navCollisionStatsBtn = document.getElementById('nav-collision-stats');
const navAiVsRandomBtn = document.getElementById('nav-ai-vs-random');
const navRecentComparisonBtn = document.getElementById('nav-recent-comparison');

let allLottoNumbers = [];
let currentPage = 1;
let manualSelectedNumbers = [];

// --- View Toggling ---
function switchView(viewName) {
  const views = [historyView, searchView, recommendView, analysisView, aiProView, manualCheckView, photoView, simulationView, performanceView, statsView, statsRecentView, collisionView, collisionStatsView, aiVsRandomView, recentComparisonView];
  views.forEach(v => { if(v) v.style.display = 'none'; });
  
  const viewMap = { 
    history: historyView, 
    search: searchView, 
    recommend: recommendView, 
    analysis: analysisView, 
    'ai-pro': aiProView, 
    'manual-check': manualCheckView, 
    photo: photoView, 
    simulation: simulationView, 
    performance: performanceView, 
    stats: statsView, 
    'stats-recent': statsRecentView, 
    collision: collisionView, 
    'collision-stats': collisionStatsView, 
    'ai-vs-random': aiVsRandomView,
    'recent-comparison': recentComparisonView
  };
  if (viewMap[viewName]) viewMap[viewName].style.display = 'block';

  const buttons = [navHistoryBtn, navSearchBtn, navRecommendBtn, navAnalysisBtn, navAiProBtn, navManualCheckBtn, navPhotoBtn, navSimulationBtn, navPerformanceBtn, navStatsBtn, navStatsRecentBtn, navCollisionBtn, navCollisionStatsBtn, navAiVsRandomBtn, navRecentComparisonBtn];
  buttons.forEach(b => { if(b) b.classList.remove('active'); });
  
  const btnMap = { 
    history: navHistoryBtn, 
    search: navSearchBtn, 
    recommend: navRecommendBtn, 
    analysis: navAnalysisBtn, 
    'ai-pro': navAiProBtn, 
    'manual-check': navManualCheckBtn, 
    photo: navPhotoBtn, 
    simulation: navSimulationBtn, 
    performance: navPerformanceBtn, 
    stats: navStatsBtn, 
    'stats-recent': navStatsRecentBtn, 
    collision: navCollisionBtn, 
    'collision-stats': navCollisionStatsBtn, 
    'ai-vs-random': navAiVsRandomBtn,
    'recent-comparison': navRecentComparisonBtn
  };
  if (btnMap[viewName]) btnMap[viewName].classList.add('active');

  if (viewName === 'history') renderHistory(currentPage);
  if (viewName === 'stats') renderStats();
  if (viewName === 'stats-recent') renderStatsRecent();
  if (viewName === 'collision') renderCollisions();
  if (viewName === 'collision-stats') renderCollisionHistogram();
  if (viewName === 'manual-check') renderManualSelection();
  if (viewName === 'ai-pro') renderAIPro();
  if (viewName === 'ai-vs-random') {
    // Optionally trigger something when the view is opened
    console.log('AI vs Random view opened');
  }
}

if (navHistoryBtn) navHistoryBtn.onclick = () => switchView('history');
if (navSearchBtn) navSearchBtn.onclick = () => switchView('search');
if (navRecommendBtn) navRecommendBtn.onclick = () => switchView('recommend');
if (navAnalysisBtn) navAnalysisBtn.onclick = () => switchView('analysis');
if (navAiProBtn) navAiProBtn.onclick = () => switchView('ai-pro');
if (navManualCheckBtn) navManualCheckBtn.onclick = () => switchView('manual-check');
if (navPhotoBtn) navPhotoBtn.onclick = () => switchView('photo');
if (navSimulationBtn) navSimulationBtn.onclick = () => switchView('simulation');
if (navPerformanceBtn) navPerformanceBtn.onclick = () => switchView('performance');
if (navStatsBtn) navStatsBtn.onclick = () => switchView('stats');
if (navStatsRecentBtn) navStatsRecentBtn.onclick = () => switchView('stats-recent');
if (navCollisionBtn) navCollisionBtn.onclick = () => switchView('collision');
if (navCollisionStatsBtn) navCollisionStatsBtn.onclick = () => switchView('collision-stats');
if (navAiVsRandomBtn) navAiVsRandomBtn.onclick = () => switchView('ai-vs-random');
if (navRecentComparisonBtn) navRecentComparisonBtn.onclick = () => switchView('recent-comparison');

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
if (searchButton) searchButton.onclick = handleSearch;
if (searchSelect) searchSelect.onchange = handleSearch;

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
if (generateBtn) generateBtn.onclick = renderRecommendations;

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
if (analysisGenerateBtn) analysisGenerateBtn.onclick = renderAnalysis;

// --- Manual Check View ---
function renderManualSelection() {
    if (manualSelectionGrid.children.length > 0) {
        const buttons = manualSelectionGrid.querySelectorAll('.manual-ball-btn');
        buttons.forEach(btn => {
            const num = parseInt(btn.textContent);
            if (manualSelectedNumbers.includes(num)) btn.classList.add('selected');
            else btn.classList.remove('selected');
        });
        return;
    }
    
    for (let i = 1; i <= 45; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('manual-ball-btn');
        btn.onclick = () => toggleManualNumber(i, btn);
        manualSelectionGrid.appendChild(btn);
    }
}

function toggleManualNumber(num, btn) {
    if (manualSelectedNumbers.includes(num)) {
        manualSelectedNumbers = manualSelectedNumbers.filter(n => n !== num);
        btn.classList.remove('selected');
    } else {
        if (manualSelectedNumbers.length >= 6) {
            alert('최대 6개까지만 선택할 수 있습니다.');
            return;
        }
        manualSelectedNumbers.push(num);
        btn.classList.add('selected');
    }
    updateManualSelectionUI();
}

function updateManualSelectionUI() {
    selectedNumbersDisplay.innerHTML = '';
    if (manualSelectedNumbers.length === 0) {
        selectedNumbersDisplay.innerHTML = '<span class="placeholder">번호를 선택해주세요 (0/6)</span>';
        manualAnalyzeBtn.disabled = true;
        return;
    }
    
    const sorted = [...manualSelectedNumbers].sort((a, b) => a - b);
    sorted.forEach(n => {
        const ball = document.createElement('span');
        ball.textContent = n;
        ball.className = `mini-ball ${getBallColorClass(n)}`;
        selectedNumbersDisplay.appendChild(ball);
    });
    
    manualAnalyzeBtn.disabled = manualSelectedNumbers.length !== 6;
    if (manualSelectedNumbers.length < 6) {
        const countSpan = document.createElement('span');
        countSpan.textContent = ` (${manualSelectedNumbers.length}/6)`;
        countSpan.className = 'selection-count';
        selectedNumbersDisplay.appendChild(countSpan);
    }
}

function handleManualAnalysis() {
    if (manualSelectedNumbers.length !== 6) return;
    
    manualCheckResultContainer.innerHTML = '<p style="text-align:center;">역대 기록과 대조 중...</p>';
    
    setTimeout(() => {
        const resultHtml = calculateWinsForSet(manualSelectedNumbers);
        manualCheckResultContainer.innerHTML = resultHtml;
    }, 100);
}

function calculateWinsForSet(myNumbersInput) {
    const myNumbers = [...myNumbersInput].sort((a, b) => a - b);
    const winStats = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    let totalWins = 0;

    allLottoNumbers.forEach(round => {
        const res = checkRank(myNumbers, round);
        if (res.rank > 0) {
            winStats[res.rank].push(round);
            totalWins++;
        }
    });

    let html = `<div class="stats-card"><h3>분석 결과: 총 ${totalWins}회 당첨</h3>`;
    html += '<div class="manual-summary-grid">';
    [1, 2, 3, 4, 5].forEach(rank => {
        const count = winStats[rank].length;
        html += `<div class="summary-item"><span class="rank-label">${rank}등</span> <span class="rank-count">${count}회</span></div>`;
    });
    html += '</div></div>';

    if (totalWins > 0) {
        html += `<h3>상세 당첨 내역 (최근 순)</h3>`;
        [1, 2, 3, 4, 5].forEach(rank => {
            if (winStats[rank].length > 0) {
                html += `<div class="rank-group"><h4>${rank}등 (${winStats[rank].length}회)</h4><div class="rank-list">`;
                winStats[rank].slice(0, 10).forEach(round => {
                    html += `<div class="rank-round-item">제 ${round.drwNo}회 (${round.drwNoDate})</div>`;
                });
                if (winStats[rank].length > 10) html += `<div class="rank-round-more">...외 ${winStats[rank].length - 10}건 더 있음</div>`;
                html += '</div></div>';
            }
        });
    } else {
        html += '<p class="info-msg" style="text-align:center;">역대 5등 이내 당첨 기록이 없습니다.</p>';
    }
    return html;
}

function handleManualReset() {
    manualSelectedNumbers = [];
    const buttons = manualSelectionGrid.querySelectorAll('.manual-ball-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    updateManualSelectionUI();
    manualCheckResultContainer.innerHTML = '';
}

if (manualAnalyzeBtn) manualAnalyzeBtn.onclick = handleManualAnalysis;
if (manualResetBtn) manualResetBtn.onclick = handleManualReset;

// --- Photo Analysis (Advanced Anchor Engine) ---
if (uploadArea) {
    uploadArea.onclick = () => photoInput.click();
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault(); e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'), false);
    });

    uploadArea.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file) handlePhotoFile(file);
    });

    photoInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handlePhotoFile(file);
    };
    
    function handlePhotoFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
            photoAnalyzeBtn.style.display = 'block';
            photoResultsContainer.innerHTML = '';
        };
        reader.readAsDataURL(file);
    }
    
    photoAnalyzeBtn.onclick = async () => {
        const file = photoInput.files[0] || (photoPreview.src ? await fetch(photoPreview.src).then(r => r.blob()) : null);
        if (!file) return;
        
        ocrProgressContainer.style.display = 'block';
        photoAnalyzeBtn.disabled = true;
        photoResultsContainer.innerHTML = '';
        
        try {
            // High-resolution preprocessing
            const processedImg = await preprocessImageV4(file);
            
            // Language eng+kor to detect '동' (Dong)
            const { data } = await Tesseract.recognize(
                processedImg,
                'eng+kor',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            ocrStatusText.textContent = `패턴 분석기 가동 중... ${(m.progress * 100).toFixed(0)}%`;
                            ocrProgressBar.style.width = `${m.progress * 100}%`;
                        }
                    }
                }
            );

            const combinations = extractDongAnchorCombinations(data.text);
            renderPhotoAnalysisResults(combinations);
            
        } catch (err) {
            console.error(err);
            alert('인식 오류가 발생했습니다. 번호가 선명한 사진으로 다시 시도해주세요.');
        } finally {
            ocrProgressContainer.style.display = 'none';
            photoAnalyzeBtn.disabled = false;
            ocrProgressBar.style.width = '0%';
        }
    };
}

async function preprocessImageV4(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const targetWidth = 2000;
            const scale = targetWidth / img.width;
            canvas.width = targetWidth;
            canvas.height = img.height * scale;
            
            // Grayscale & Sharpen
            ctx.filter = 'grayscale(100%) contrast(200%) brightness(90%)';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Apply a sharpening effect by re-drawing with a slight offset or just higher contrast
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = typeof file === 'string' ? file : URL.createObjectURL(file);
    });
}

function extractDongAnchorCombinations(text) {
    // Standardize text
    const cleanedText = text.toUpperCase()
        .replace(/O/g, '0').replace(/[IL|]/g, '1').replace(/S/g, '5')
        .replace(/B/g, '8').replace(/G/g, '6').replace(/Z/g, '2');
        
    const lines = cleanedText.split('\n');
    const finalCombos = [];
    
    // Core Logic: Look for '동' (Manual/Auto label) and grab next 6 numbers
    lines.forEach(line => {
        // Search for '동' character (can be misread as DONG, DUNG, etc in Eng, but Kor engine helps)
        // Check both Korean '동' and common English misreads of it
        const anchorIndex = line.indexOf('동');
        let numbersPart = '';
        
        if (anchorIndex !== -1) {
            numbersPart = line.substring(anchorIndex + 1);
        } else {
            // Fallback: If '동' is not found, maybe look for [자/수/반자] characters
            const fallbackAnchors = ['자동', '수동', '반자'];
            for(const fa of fallbackAnchors) {
                if(line.includes(fa)) {
                    numbersPart = line.substring(line.indexOf(fa) + fa.length);
                    break;
                }
            }
        }

        if (numbersPart) {
            const nums = (numbersPart.match(/\b([1-9]|[1-3][0-9]|4[0-5])\b/g) || [])
                .map(n => parseInt(n));
            
            if (nums.length >= 6) {
                // Grab the first 6 unique numbers after the anchor
                const game = [];
                const seen = new Set();
                for (const n of nums) {
                    if (!seen.has(n)) {
                        game.push(n);
                        seen.add(n);
                    }
                    if (game.length === 6) break;
                }
                
                if (game.length === 6) {
                    finalCombos.push(game.sort((a, b) => a - b));
                }
            }
        }
    });

    // Fallback: If '동' logic failed to find 5 lines, use the old sequence logic
    if (finalCombos.length < 5) {
        lines.forEach(line => {
            const nums = (line.match(/\b([1-9]|[1-3][0-9]|4[0-5])\b/g) || []).map(n => parseInt(n));
            if (nums.length >= 6) {
                const game = [...new Set(nums.slice(-6))].sort((a, b) => a - b);
                const key = game.join(',');
                if (game.length === 6 && !finalCombos.some(c => c.join(',') === key)) {
                    finalCombos.push(game);
                }
            }
        });
    }

    // Dedup and return top 5
    const result = [];
    const seenKeys = new Set();
    finalCombos.forEach(c => {
        const key = c.join(',');
        if (!seenKeys.has(key)) {
            result.push(c);
            seenKeys.add(key);
        }
    });

    return result.slice(0, 5);
}

function renderPhotoAnalysisResults(combinations) {
    if (combinations.length === 0) {
        photoResultsContainer.innerHTML = '<div class="stats-card" style="border-top:4px solid #d32f2f; margin-top:20px;"><p class="info-msg" style="text-align:center;">⚠️ 번호 인식 실패<br><b>"자동/수동" 글자와 숫자 6개</b>가 선명하게 보이도록<br>밝은 곳에서 다시 찍어주세요.</p></div>';
        return;
    }

    let html = `<h3 style="text-align:center; margin:30px 0 20px;">🎯 분석 결과 (${combinations.length}개 조합 발견)</h3>`;
    
    combinations.forEach((myNumbers, idx) => {
        const winStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalWins = 0;

        allLottoNumbers.forEach(round => {
            const res = checkRank(myNumbers, round);
            if (res.rank > 0) {
                winStats[res.rank]++;
                totalWins++;
            }
        });

        const ballsHtml = `<div class="numbers" style="margin:15px 0;">` + myNumbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `</div>`;
        
        html += `
            <div class="stats-card" style="margin-bottom:20px; border-left: 5px solid #1877f2; animation: fadeIn 0.5s ease-out;">
                <div class="pro-label-row">
                    <span class="game-label" style="background:#1877f2; color:white; padding:3px 12px; border-radius:15px; font-size:0.9em;">조합 ${String.fromCharCode(65 + idx)} 판독</span>
                    <span class="pro-tag" style="background:#fff3f3; color:#d32f2f; font-weight:bold;">과거 총 ${totalWins}회 당첨</span>
                </div>
                ${ballsHtml}
                <div class="manual-summary-grid" style="grid-template-columns: repeat(5, 1fr); gap: 5px;">
                    <div class="summary-item"><span class="rank-label">1등</span> <span class="rank-count" style="color:${winStats[1]>0?'#d32f2f':'#ccc'}">${winStats[1]}</span></div>
                    <div class="summary-item"><span class="rank-label">2등</span> <span class="rank-count" style="color:${winStats[2]>0?'#d32f2f':'#ccc'}">${winStats[2]}</span></div>
                    <div class="summary-item"><span class="rank-label">3등</span> <span class="rank-count" style="color:${winStats[3]>0?'#d32f2f':'#ccc'}">${winStats[3]}</span></div>
                    <div class="summary-item"><span class="rank-label">4등</span> <span class="rank-count" style="color:${winStats[4]>0?'#d32f2f':'#ccc'}">${winStats[4]}</span></div>
                    <div class="summary-item"><span class="rank-label">5등</span> <span class="rank-count" style="color:${winStats[5]>0?'#d32f2f':'#ccc'}">${winStats[5]}</span></div>
                </div>
            </div>
        `;
    });

    photoResultsContainer.innerHTML = html;
    photoResultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// --- Simulation View ---
function runSimulation() {
    simulationResultContainer.innerHTML = '<p style="text-align:center;">1,000개 조합 생성 및 과거 성적 분석 중... (약 2-3초 소요)</p>';
    setTimeout(() => {
        const WEIGHTS = { 1: 1000, 2: 500, 3: 400, 4: 200, 5: 100 };
        const combinations = [];
        for (let i = 0; i < 1000; i++) {
            const myNumbers = generateRandomNumbers();
            const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let totalScore = 0;
            allLottoNumbers.forEach(round => {
                const res = checkRank(myNumbers, round);
                if (res.rank > 0) {
                    stats[res.rank]++;
                    totalScore += WEIGHTS[res.rank];
                }
            });
            combinations.push({ numbers: myNumbers, stats, score: totalScore });
        }
        combinations.sort((a, b) => b.score - a.score || b.stats[1] - a.stats[1]);
        const top3 = combinations.slice(0, 3);
        let html = '';
        top3.forEach((item, index) => {
            const ballsHtml = `<div class="numbers">` + item.numbers.map(n => `<span class="${getBallColorClass(n)}">${n}</span>`).join('') + `</div>`;
            html += `
                <div class="stats-card" style="border-top: 5px solid ${index === 0 ? '#d32f2f' : (index === 1 ? '#fbc02d' : '#757575')}">
                    <div class="pro-label-row">
                        <span class="game-label" style="font-size:1.2em;">🏆 Top ${index + 1} 위</span>
                        <span class="pro-tag" style="background:#fff3f3; color:#d32f2f;">누적 점수: ${item.score}점</span>
                    </div>
                    ${ballsHtml}
                    <div class="manual-summary-grid" style="margin-top:10px;">
                        <div class="summary-item"><span class="rank-label">1등</span> <span class="rank-count">${item.stats[1]}회</span></div>
                        <div class="summary-item"><span class="rank-label">2등</span> <span class="rank-count">${item.stats[2]}회</span></div>
                        <div class="summary-item"><span class="rank-label">3등</span> <span class="rank-count">${item.stats[3]}회</span></div>
                        <div class="summary-item"><span class="rank-label">4등</span> <span class="rank-count">${item.stats[4]}회</span></div>
                        <div class="summary-item"><span class="rank-label">5등</span> <span class="rank-count">${item.stats[5]}회</span></div>
                    </div>
                </div>
            `;
        });
        simulationResultContainer.innerHTML = html;
    }, 100);
}
if (simulationRunBtn) simulationRunBtn.onclick = runSimulation;

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
if (performanceButton) performanceButton.onclick = handlePerformance;
if (performanceSelect) performanceSelect.onchange = handlePerformance;

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

function renderStatsRecent() {
    statsRecentContainer.innerHTML = '<p style="text-align:center;">분석 중입니다... 잠시만 기다려주세요.</p>';
    setTimeout(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 0: 0 };
        const dataSorted = [...allLottoNumbers].sort((a, b) => a.drwNo - b.drwNo);
        const startIndex = dataSorted.findIndex(d => d.drwNo >= 1000);
        if (startIndex === -1) {
            statsRecentContainer.innerHTML = '<p class="info-msg">분석 대상 데이터가 부족합니다 (1000회 이상).</p>';
            return;
        }
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
        statsRecentContainer.innerHTML = html;
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

// --- Collision Stats View ---
function renderCollisionHistogram() {
    collisionStatsContainer.innerHTML = '<p style="text-align:center;">중복 데이터를 분석하고 있습니다... (약 5-10초 소요)</p>';
    setTimeout(() => {
        const numFreq = Array(46).fill(0);
        const dataSorted = [...allLottoNumbers].sort((a, b) => a.drwNo - b.drwNo);
        let collisionCount = 0;
        for (let i = 0; i < dataSorted.length; i++) {
            const current = dataSorted[i];
            const myNumbers = [current.drwtNo1, current.drwtNo2, current.drwtNo3, current.drwtNo4, current.drwtNo5, current.drwtNo6];
            for (let j = 0; j < i; j++) {
                const prev = dataSorted[j];
                const res = checkRank(myNumbers, prev);
                if (res.rank === 1 || res.rank === 2 || res.rank === 3) {
                    collisionCount++;
                    res.matchedNumbers.forEach(num => {
                        numFreq[num]++;
                    });
                }
            }
        }
        if (collisionCount === 0) {
            collisionStatsContainer.innerHTML = '<p class="info-msg">역대 3등 이내 중복 당첨 사례가 없습니다.</p>';
            return;
        }
        const freqList = [];
        for (let i = 1; i <= 45; i++) {
            freqList.push({ num: i, count: numFreq[i] });
        }
        freqList.sort((a, b) => b.count - a.count || a.num - b.num);
        const maxFreq = Math.max(...numFreq);
        let html = `<div class="stats-card"><h3>중복 당첨 번호 빈도 TOP 15 (총 ${collisionCount}건의 사례 분석)</h3><div class="histogram">`;
        freqList.slice(0, 15).forEach(item => {
            const barWidth = ((item.count / maxFreq) * 100).toFixed(1);
            const ballClass = getBallColorClass(item.num);
            html += `
                <div class="hist-row">
                    <div class="hist-label" style="display:flex; align-items:center; gap:5px; width:60px;">
                        <span class="mini-ball ${ballClass}">${item.num}</span>
                    </div>
                    <div class="hist-bar-container">
                        <div class="hist-bar" style="width: ${barWidth}%; background: ${item.count === maxFreq ? '#d32f2f' : '#1877f2'}"></div>
                        <div class="hist-value">${item.count}회</div>
                    </div>
                </div>`;
        });
        html += '</div></div>';
        html += `<div class="stats-card"><h3>전체 번호별 중복 기여도</h3><div class="freq-grid">`;
        for (let i = 1; i <= 45; i++) {
            const count = numFreq[i];
            const ballClass = getBallColorClass(i);
            html += `<div class="freq-grid-item"><span class="mini-ball ${ballClass}">${i}</span> <span class="freq-count">${count}</span></div>`;
        }
        html += `</div></div>`;
        collisionStatsContainer.innerHTML = html;
    }, 100);
}

// --- AI Analysis Helpers ---
function getAIPatternData(sourceData = allLottoNumbers) {
    const freq = Array(46).fill(0);
    const recent100Freq = Array(46).fill(0);
    const lastAppearance = Array(46).fill(0);
    // Sort ascending for correct processing order if needed, but here we just need counts
    const sortedData = [...sourceData].sort((a, b) => a.drwNo - b.drwNo);
    const totalRounds = sortedData.length;
    
    sortedData.forEach((item, idx) => {
        const nums = [item.drwtNo1, item.drwtNo2, item.drwtNo3, item.drwtNo4, item.drwtNo5, item.drwtNo6];
        nums.forEach(n => {
            freq[n]++;
            if (idx >= totalRounds - 100) recent100Freq[n]++;
            lastAppearance[n] = item.drwNo;
        });
    });

    const latestRound = sortedData[totalRounds - 1]?.drwNo || 0;
    const hotNumbers = [];
    const coldNumbers = [];
    const recentSorted = [];
    for(let i=1; i<=45; i++) recentSorted.push({num: i, count: recent100Freq[i]});
    recentSorted.sort((a, b) => b.count - a.count);
    for(let i=0; i<10; i++) hotNumbers.push(recentSorted[i].num);
    for(let i=1; i<=45; i++) {
        if (latestRound - lastAppearance[i] >= 30) coldNumbers.push(i);
    }
    
    return { hotNumbers, coldNumbers };
}

function generateAICombination(hotNumbers, coldNumbers) {
    let myNumbers = [];
    let attempts = 0;
    const poolNormal = [];
    for(let i=1; i<=45; i++) if(!hotNumbers.includes(i) && !coldNumbers.includes(i)) poolNormal.push(i);
    
    const pick = (arr, count) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    while(attempts < 1000) {
        attempts++;
        const selected = [
            ...pick(hotNumbers, 2),
            ...pick(coldNumbers, 1),
            ...pick(poolNormal, 3)
        ];
        if (new Set(selected).size !== 6) continue;
        selected.sort((a, b) => a - b);
        const sum = selected.reduce((a, b) => a + b, 0);
        const odds = selected.filter(n => n % 2 !== 0).length;
        if (sum >= 100 && sum <= 175 && odds >= 2 && odds <= 4) {
            myNumbers = selected;
            break;
        }
    }
    return myNumbers.length === 6 ? myNumbers : generateRandomNumbers();
}

// --- AI vs Random View ---
function runAIVsRandomSimulation() {
    aiVsRandomResultContainer.innerHTML = `
        <div style="text-align:center; padding:30px; background:white; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            <div class="loading-spinner"></div>
            <h3 style="margin-bottom:10px;">⚡ 대규모 시뮬레이션 진행 중...</h3>
            <p style="color:#666; font-size:0.9em;">
                <b>Step 1:</b> AI 학습 (1~800회 데이터 분석)<br>
                <b>Step 2:</b> 801~1000회차 매주 10장씩 구매<br>
                <b>Step 3:</b> 위 과정을 1,000번 반복 (총 400만 게임)<br>
                <br>약 5-10초 소요됩니다.
            </p>
        </div>
    `;
    
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.innerHTML = `
            .loading-spinner {
                width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #1877f2;
                border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .battle-scoreboard {
                display: flex; justify-content: space-around; align-items: center; margin: 20px 0;
                background: #f8f9fa; padding: 20px; border-radius: 15px; border: 1px solid #eee;
            }
            .score-item { text-align: center; }
            .score-num { font-size: 2.5em; font-weight: 900; display: block; }
            .win-rate-bar {
                height: 12px; background: #eee; border-radius: 6px; overflow: hidden; display: flex; margin: 10px 0;
            }
            .win-rate-fill-ai { background: #1877f2; height: 100%; transition: width 1s ease-out; }
            .win-rate-fill-random { background: #757575; height: 100%; transition: width 1s ease-out; }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        const startTime = performance.now();

        // 1. Prepare Data
        const trainingData = allLottoNumbers.filter(r => r.drwNo <= 800);
        const testRounds = allLottoNumbers.filter(r => r.drwNo >= 801 && r.drwNo <= 1000);
        
        // 2. Train AI (Get patterns from history up to 800)
        const { hotNumbers, coldNumbers } = getAIPatternData(trainingData);

        const SIMULATION_REPS = 1000;
        const TICKETS_PER_ROUND = 10;
        const COST_PER_TICKET = 1000;

        let aiTotalRevenue = 0;
        let randomTotalRevenue = 0;
        let aiWinCount = 0; // How many 'seasons' AI won
        let randomWinCount = 0; // How many 'seasons' Random won
        let drawCount = 0;

        // Rank counters
        const aiRankStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const randomRankStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        // Fallback prizes
        const fallbacks = { 1: 2000000000, 2: 50000000, 3: 1500000, 4: 50000, 5: 5000 };

        // 3. Run Simulation
        for (let rep = 0; rep < SIMULATION_REPS; rep++) {
            let aiSeasonRevenue = 0;
            let randomSeasonRevenue = 0;

            testRounds.forEach(round => {
                // Buy AI Tickets
                for(let t=0; t<TICKETS_PER_ROUND; t++) {
                    const ticket = generateAICombination(hotNumbers, coldNumbers);
                    const res = checkRank(ticket, round);
                    if (res.rank > 0) {
                        aiRankStats[res.rank]++;
                        aiSeasonRevenue += (round.prizes && round.prizes[res.rank - 1]) ? round.prizes[res.rank - 1].amount : fallbacks[res.rank];
                    }
                }
                // Buy Random Tickets
                for(let t=0; t<TICKETS_PER_ROUND; t++) {
                    const ticket = generateRandomNumbers();
                    const res = checkRank(ticket, round);
                    if (res.rank > 0) {
                        randomRankStats[res.rank]++;
                        randomSeasonRevenue += (round.prizes && round.prizes[res.rank - 1]) ? round.prizes[res.rank - 1].amount : fallbacks[res.rank];
                    }
                }
            });

            aiTotalRevenue += aiSeasonRevenue;
            randomTotalRevenue += randomSeasonRevenue;

            if (aiSeasonRevenue > randomSeasonRevenue) aiWinCount++;
            else if (randomSeasonRevenue > aiSeasonRevenue) randomWinCount++;
            else drawCount++;
        }

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        const aiWinRate = ((aiWinCount / SIMULATION_REPS) * 100).toFixed(1);
        const randomWinRate = ((randomWinCount / SIMULATION_REPS) * 100).toFixed(1);
        
        // Calculate average revenue per season (200 rounds * 10 tickets = 2000 tickets)
        const totalInvestmentPerSeason = testRounds.length * TICKETS_PER_ROUND * COST_PER_TICKET;
        const aiAvgRevenue = Math.floor(aiTotalRevenue / SIMULATION_REPS);
        const randomAvgRevenue = Math.floor(randomTotalRevenue / SIMULATION_REPS);
        const aiRoi = ((aiAvgRevenue - totalInvestmentPerSeason) / totalInvestmentPerSeason * 100).toFixed(2);
        const randomRoi = ((randomAvgRevenue - totalInvestmentPerSeason) / totalInvestmentPerSeason * 100).toFixed(2);

        const formatRank = (stats) => {
            return `
                <div class="stats-grid" style="margin-top:10px; border-top:1px solid #eee; padding-top:10px;">
                    <div>1등: <b>${stats[1]}</b></div>
                    <div>2등: <b>${stats[2]}</b></div>
                    <div>3등: <b>${stats[3]}</b></div>
                    <div>4등: <b>${stats[4]}</b></div>
                    <div>5등: <b>${stats[5]}</b></div>
                </div>
            `;
        };

        let html = `
            <div class="recommend-header">
                <h2>📊 801~1000회차 시뮬레이션 결과</h2>
                <p>총 400만 게임 (1,000회 반복 x 200주 x 20게임) 분석 완료</p>
            </div>

            <div class="battle-scoreboard">
                <div class="score-item">
                    <span style="color:#1877f2; font-weight:bold;">🤖 AI 승리 횟수</span>
                    <span class="score-num" style="color:#1877f2;">${aiWinCount}회</span>
                    <span style="font-size:0.8em; color:#666;">승률 ${aiWinRate}%</span>
                </div>
                <div style="font-size: 1.5em; font-weight:bold; color:#ccc;">VS</div>
                <div class="score-item">
                    <span style="color:#757575; font-weight:bold;">🎲 랜덤 승리 횟수</span>
                    <span class="score-num" style="color:#757575;">${randomWinCount}회</span>
                    <span style="font-size:0.8em; color:#666;">승률 ${randomWinRate}%</span>
                </div>
            </div>

            <div style="padding: 0 20px 20px;">
                <div class="win-rate-bar">
                    <div class="win-rate-fill-ai" style="width:${aiWinRate}%"></div>
                    <div class="win-rate-fill-random" style="width:${randomWinRate}%"></div>
                </div>
                <div style="text-align:center; font-size:0.8em; color:#888; margin-top:5px;">무승부: ${drawCount}회</div>
            </div>

            <div class="comparison-summary">
                <div class="summary-card ai" style="border-top-color:#1877f2;">
                    <h3 style="color:#1877f2;">🤖 AI 총 평점</h3>
                    <div class="total-prize" style="color:#1877f2; font-size:1.3em;">평균 ${formatCurrency(aiAvgRevenue)}</div>
                    <p style="font-size:0.8em; color:#666;">누적 당첨금: ${formatCurrency(aiTotalRevenue)}</p>
                    <p style="font-size:0.9em; font-weight:bold; color:${aiRoi >= 0 ? '#d32f2f' : '#1877f2'};">수익률: ${aiRoi}%</p>
                    ${formatRank(aiRankStats)}
                </div>
                <div class="summary-card random" style="border-top-color:#757575;">
                    <h3 style="color:#757575;">🎲 랜덤 총 평점</h3>
                    <div class="total-prize" style="color:#757575; font-size:1.3em;">평균 ${formatCurrency(randomAvgRevenue)}</div>
                    <p style="font-size:0.8em; color:#666;">누적 당첨금: ${formatCurrency(randomTotalRevenue)}</p>
                    <p style="font-size:0.9em; font-weight:bold; color:${randomRoi >= 0 ? '#d32f2f' : '#1877f2'};">수익률: ${randomRoi}%</p>
                    ${formatRank(randomRankStats)}
                </div>
            </div>

            <div class="vs-badge ${aiWinCount >= randomWinCount ? 'ai-win' : 'random-win'}" style="margin-top:30px;">
                ${aiWinCount >= randomWinCount ? 'AI 전략 승리!' : '랜덤 운 승리!'}
            </div>

            <div class="stats-card" style="margin-top:20px;">
                <h4>💡 분석 인사이트</h4>
                <p>이번 시뮬레이션은 <b>과거 데이터(1~800회)</b>만을 학습한 AI가 <b>미래(801~1000회)</b>를 예측하는 블라인드 테스트 방식입니다.</p>
                <p>${aiWinCount > randomWinCount ? 
                    'AI가 랜덤보다 높은 승률을 기록했습니다. 이는 "핫/콜드 번호" 및 "합계 구간" 패턴이 특정 기간 동안 유의미하게 작용했음을 시사합니다.' : 
                    '랜덤이 더 높은 승률을 기록했습니다. 이는 로또가 독립 시행의 성격이 강하며, 과거 데이터 패턴이 미래 당첨을 보장하지 않음을 보여줍니다.'}</p>
                <p style="font-size:0.8em; color:#999; text-align:right;">총 소요 시간: ${duration}초</p>
            </div>
        `;
        
        aiVsRandomResultContainer.innerHTML = html;
        aiVsRandomResultContainer.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

if (aiVsRandomRunBtn) aiVsRandomRunBtn.onclick = runAIVsRandomSimulation;

// --- AI Pro View ---
function renderAIPro() {
    if (!allLottoNumbers || allLottoNumbers.length === 0) return;
    aiProContainer.innerHTML = '<p style="text-align:center;">AI 패턴 분석 중...</p>';
    setTimeout(() => {
        const { hotNumbers, coldNumbers } = getAIPatternData();
        aiProContainer.innerHTML = '';
        for (let c = 1; c <= 5; c++) {
            const myNumbers = generateAICombination(hotNumbers, coldNumbers);
            const card = document.createElement('div');
            card.classList.add('recommend-card');
            card.style.borderLeft = '4px solid #4a90e2';
            let ballsHtml = `<div class="numbers">` + myNumbers.map(n => {
                let extraClass = '';
                if (hotNumbers.includes(n)) extraClass = 'hot-num';
                if (coldNumbers.includes(n)) extraClass = 'cold-num';
                return `<span class="${getBallColorClass(n)} ${extraClass}">${n}</span>`;
            }).join('') + `</div>`;
            const sum = myNumbers.reduce((a, b) => a + b, 0);
            const odds = myNumbers.filter(n => n % 2 !== 0).length;
            const evens = 6 - odds;
            card.innerHTML = `
                <div class="pro-label-row">
                    <span class="game-label">AI 조합 ${c}</span>
                    <span class="pro-tag">패턴 분석 완료</span>
                </div>
                ${ballsHtml}
                <div class="pattern-info">
                    <span>합계: ${sum}</span>
                    <span>홀짝: ${odds}:${evens}</span>
                </div>
            `;
            aiProContainer.appendChild(card);
        }
        const legend = document.createElement('div');
        legend.className = 'analysis-legend';
        legend.innerHTML = `
            <div class="legend-item"><span class="dot hot"></span> 최근 자주 출현 (Hot)</div>
            <div class="legend-item"><span class="dot cold"></span> 장기 미출현 (Cold)</div>
        `;
        aiProContainer.prepend(legend);
    }, 500);
}
if (aiProGenerateBtn) aiProGenerateBtn.onclick = renderAIPro;

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

// --- Recent Comparison View ---
function runRecentComparisonSimulation() {
    if (!allLottoNumbers || allLottoNumbers.length < 10) {
        alert('데이터가 충분하지 않습니다.');
        return;
    }

    recentComparisonResultContainer.innerHTML = `
        <div style="text-align:center; padding:30px; background:white; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
            <div class="loading-spinner"></div>
            <h3 style="margin-bottom:10px;">📉 최근 10회차 비교 분석 중...</h3>
            <p style="color:#666; font-size:0.9em;">각 회차별 AI 10매 vs 랜덤 10매 시뮬레이션 중</p>
        </div>
    `;

    setTimeout(() => {
        const latest10 = [...allLottoNumbers].slice(0, 10).reverse(); // Oldest to newest of the last 10
        const COST_PER_TICKET = 1000;
        const TICKETS_PER_ROUND = 10;
        const fallbacks = { 1: 2000000000, 2: 50000000, 3: 1500000, 4: 50000, 5: 5000 };

        let aiGrandTotalPrize = 0;
        let randomGrandTotalPrize = 0;
        let aiGrandTotalWins = 0;
        let randomGrandTotalWins = 0;

        const roundResults = latest10.map(round => {
            // Training data for AI is all data BEFORE this round
            const trainingData = allLottoNumbers.filter(r => r.drwNo < round.drwNo);
            const { hotNumbers, coldNumbers } = getAIPatternData(trainingData);

            let aiRoundPrize = 0;
            let randomRoundPrize = 0;
            let aiRoundWins = 0;
            let randomRoundWins = 0;

            for (let i = 0; i < TICKETS_PER_ROUND; i++) {
                // AI
                const aiTicket = generateAICombination(hotNumbers, coldNumbers);
                const aiRes = checkRank(aiTicket, round);
                if (aiRes.rank > 0) {
                    aiRoundWins++;
                    aiRoundPrize += (round.prizes && round.prizes[aiRes.rank - 1]) ? round.prizes[aiRes.rank - 1].amount : fallbacks[aiRes.rank];
                }

                // Random
                const randomTicket = generateRandomNumbers();
                const randomRes = checkRank(randomTicket, round);
                if (randomRes.rank > 0) {
                    randomRoundWins++;
                    randomRoundPrize += (round.prizes && round.prizes[randomRes.rank - 1]) ? round.prizes[randomRes.rank - 1].amount : fallbacks[randomRes.rank];
                }
            }

            aiGrandTotalPrize += aiRoundPrize;
            randomGrandTotalPrize += randomRoundPrize;
            aiGrandTotalWins += aiRoundWins;
            randomGrandTotalWins += randomRoundWins;

            return {
                drwNo: round.drwNo,
                winNums: [round.drwtNo1, round.drwtNo2, round.drwtNo3, round.drwtNo4, round.drwtNo5, round.drwtNo6, round.bnusNo],
                aiWins: aiRoundWins,
                aiPrize: aiRoundPrize,
                randomWins: randomRoundWins,
                randomPrize: randomRoundPrize
            };
        });

        const totalTickets = 10 * TICKETS_PER_ROUND;
        const totalCost = totalTickets * COST_PER_TICKET;

        const aiWinRate = (aiGrandTotalWins / totalTickets * 100).toFixed(1);
        const randomWinRate = (randomGrandTotalWins / totalTickets * 100).toFixed(1);
        const aiEV = (aiGrandTotalPrize / totalTickets).toFixed(0);
        const randomEV = (randomGrandTotalPrize / totalTickets).toFixed(0);

        let tableRows = roundResults.reverse().map(res => {
            const winBallsHtml = res.winNums.slice(0,6).map(n => `<span class="mini-ball ${getBallColorClass(n)}">${n}</span>`).join('');
            const bonusBallHtml = `<span class="mini-ball ${getBallColorClass(res.winNums[6])}">${res.winNums[6]}</span>`;
            
            return `
                <tr>
                    <td>
                        <div style="font-weight:bold; margin-bottom:5px;">${res.drwNo}회</div>
                        <div class="numbers" style="transform:scale(0.7); margin-left:-25px; white-space:nowrap;">
                            ${winBallsHtml} <span style="font-size:12px; margin:0 2px;">+</span> ${bonusBallHtml}
                        </div>
                    </td>
                    <td style="color:#1877f2; font-weight:bold; vertical-align:middle;">${res.aiWins}건 / ${formatCurrency(res.aiPrize)}</td>
                    <td style="color:#757575; vertical-align:middle;">${res.randomWins}건 / ${formatCurrency(res.randomPrize)}</td>
                </tr>
            `;
        }).join('');

        const html = `
            <div class="stats-card">
                <h3>최근 10회차 통합 성적 (총 200매)</h3>
                <div class="battle-scoreboard" style="margin-top:10px;">
                    <div class="score-item">
                        <span style="color:#1877f2; font-weight:bold;">🤖 AI 합계</span>
                        <div style="margin:5px 0;">
                            <span style="font-size:1.2em; display:block;">승률: ${aiWinRate}%</span>
                            <span style="font-size:1.2em; display:block; color:#d32f2f;">기대값: ${formatCurrency(aiEV)}</span>
                        </div>
                    </div>
                    <div style="font-size: 1.5em; font-weight:bold; color:#ccc;">VS</div>
                    <div class="score-item">
                        <span style="color:#757575; font-weight:bold;">🎲 랜덤 합계</span>
                        <div style="margin:5px 0;">
                            <span style="font-size:1.2em; display:block;">승률: ${randomWinRate}%</span>
                            <span style="font-size:1.2em; display:block; color:#d32f2f;">기대값: ${formatCurrency(randomEV)}</span>
                        </div>
                    </div>
                </div>
                <p style="font-size:0.8em; color:#888; text-align:center; margin-top:10px;">* 기대값 = 총 당첨금 / 총 구매매수 (1매당 기대 수익)</p>
            </div>

            <div class="stats-card" style="margin-top:20px;">
                <h3>회차별 상세 결과</h3>
                <table class="prize-table">
                    <thead>
                        <tr>
                            <th>회차</th>
                            <th>🤖 AI (당첨/금액)</th>
                            <th>🎲 랜덤 (당첨/금액)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="vs-badge ${aiGrandTotalPrize >= randomGrandTotalPrize ? 'ai-win' : 'random-win'}" style="margin-top:30px;">
                ${aiGrandTotalPrize >= randomGrandTotalPrize ? 'AI 전략 승리!' : '랜덤 운 승리!'}
            </div>
        `;

        recentComparisonResultContainer.innerHTML = html;
        recentComparisonResultContainer.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

if (recentComparisonRunBtn) recentComparisonRunBtn.onclick = runRecentComparisonSimulation;
