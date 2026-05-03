//// 导入模块
//import vocabularyData from './data.js';
//import cardUI from './ui.js';
//import spacedRepetition from './spaced-repetition.js';
//import vocabularyStorage from './storage.js';
//import statsManager from './stats.js';
//import settingsManager from './settings.js';
//
//let vocabularyData, cardUI, spacedRepetition, vocabularyStorage, statsManager, settingsManager;
//
//try {
//    const dataModule = await import('./data.js');
//    vocabularyData = dataModule.default;
//    const uiModule = await import('./ui.js');
//    cardUI = uiModule.default;
//    // ... 其他 import
//} catch(e) {
//    console.warn('部分模块未就绪:', e.message);
//}
//
//// 页面切换逻辑
//const navButtons = document.querySelectorAll('.nav-btn');
//const pages = document.querySelectorAll('.page');
//
//// 页面切换函数
//function switchPage(pageId) {
//    pages.forEach(page => {
//        page.classList.add('hidden');
//        page.classList.remove('visible');
//    });
//
//    const targetPage = document.getElementById(`${pageId}-page`);
//    targetPage.classList.remove('hidden');
//    targetPage.classList.add('visible');
//
//    // 更新导航按钮状态
//    navButtons.forEach(btn => {
//        btn.classList.remove('text-blue-600');
//        btn.classList.add('text-gray-600');
//    });
//    document.querySelector(`[data-page="${pageId}"]`).classList.remove('text-gray-600');
//    document.querySelector(`[data-page="${pageId}"]`).classList.add('text-blue-600');
//
//    // 初始化对应页面的内容
//    switch (pageId) {
//        case 'stats':
//            initStatsPage();
//            break;
//        case 'learning':
//            initLearningPage();
//            break;
//        case 'settings':
//            initSettingsPage();
//            break;
//    }
//}
//
//// 底部导航点击事件
//navButtons.forEach(button => {
//    button.addEventListener('click', () => {
//        const pageId = button.getAttribute('data-page');
//        switchPage(pageId);
//    });
//});
//
//// 开始学习按钮
//document.getElementById('start-learning').addEventListener('click', () => {
//    switchPage('vocabulary');
//    // 这里将来会添加学习页面的初始化逻辑
//    console.log('开始学习');
//});
//
//// 初始化首页
//switchPage('home');
//
//
//
//// 渲染词库列表
//function renderVocabularyList() {
//    const vocabularyList = document.getElementById('vocabulary-list');
//    if (!vocabularyList) return;
//
//    vocabularyList.innerHTML = '';
//
//    vocabularyData.filteredWords.forEach(word => {
//        const wordElement = document.createElement('div');
//        wordElement.className = 'p-3 border-b hover:bg-gray-50';
//
//        const statusClass = {
//            'new': 'bg-gray-200 text-gray-800',
//            'learning': 'bg-blue-200 text-blue-800',
//            'mastered': 'bg-green-200 text-green-800'
//        };
//
//        const statusText = {
//            'new': '未学习',
//            'learning': '学习中',
//            'mastered': '已掌握'
//        };
//
//        wordElement.innerHTML = `
//            <div class="flex justify-between items-center">
//                <div>
//                    <span class="font-semibold text-lg">${word.word}</span>
//                    <span class="text-gray-500 ml-2">${word.pinyin}</span>
//                </div>
//                <span class="px-2 py-1 rounded text-xs ${statusClass[word.status]}">
//                    ${statusText[word.status]}
//                </span>
//            </div>
//            <p class="text-sm text-gray-600 mt-1">${word.meaning}</p>
//        `;
//
//        vocabularyList.appendChild(wordElement);
//    });
//}
//
//// 搜索功能
//function setupSearch() {
//    const searchInput = document.querySelector('#vocabulary-page input[type="text"]');
//    if (searchInput) {
//        searchInput.addEventListener('input', (e) => {
//            vocabularyData.search(e.target.value);
//            renderVocabularyList();
//        });
//    }
//}
//
//// 状态筛选功能
//function setupFilterButtons() {
//    const filterButtons = document.querySelectorAll('#vocabulary-page button');
//    filterButtons.forEach(button => {
//        button.addEventListener('click', () => {
//            const status = button.textContent.trim();
//            vocabularyData.filterByStatus(status === '全部' ? 'all' : status);
//            renderVocabularyList();
//        });
//    });
//}
//
//// 初始化学习页面
//async function initLearningPage() {
//    try {
//        // 获取今日需要复习的词语
//        const todayReviews = await vocabularyStorage.getTodayReviews();
//
//        // 获取今日需要学习的新词
//        const todayNewWords = spacedRepetition.getTodayNewWords(vocabularyData.getAllWords(), 5); // 暂时显示5个新词
//
//        // 合并复习和新学词语
//        const wordsToLearn = [...todayReviews, ...todayNewWords];
//
//        if (wordsToLearn.length === 0) {
//            alert('今日没有需要学习的词语！');
//            switchPage('home');
//            return;
//        }
//
//        cardUI.initLearningPage(wordsToLearn);
//    } catch (error) {
//        console.error('初始化学习页面失败:', error);
//    }
//}
//
//// 初始化统计页面
//async function initStatsPage() {
//    try {
//        // 获取统计数据
//        await statsManager.getStatsData();
//        statsManager.renderStatsPage();
//    } catch (error) {
//        console.error('初始化统计页面失败:', error);
//    }
//}
//
//// 初始化设置页面
//function initSettingsPage() {
//    try {
//        // 深色模式开关点击事件
//        const darkModeToggle = document.getElementById('dark-mode-toggle');
//        if (darkModeToggle) {
//            darkModeToggle.addEventListener('change', (e) => {
//                settingsManager.toggleDarkMode(e.target.checked);
//            });
//
//            // 设置初始深色模式状态
//            const isDarkMode = settingsManager.getDarkMode();
//            darkModeToggle.checked = isDarkMode;
//            if (isDarkMode) {
//                settingsManager.toggleDarkMode(true);
//            }
//        }
//
//        // 设置每日词数按钮点击事件
//        const dailyWordsButtons = document.querySelectorAll('.daily-words-btn');
//        dailyWordsButtons.forEach(button => {
//            button.addEventListener('click', () => {
//                const count = parseInt(button.getAttribute('data-count'));
//                settingsManager.setDailyWordsCount(count);
//
//                // 更新按钮样式
//                dailyWordsButtons.forEach(btn => {
//                    btn.classList.remove('bg-blue-600', 'text-white');
//                    btn.classList.add('border');
//                });
//                button.classList.remove('border');
//                button.classList.add('bg-blue-600', 'text-white');
//            });
//        });
//
//        // 导出数据按钮点击事件
//        const exportButton = document.getElementById('export-data');
//        if (exportButton) {
//            exportButton.addEventListener('click', () => {
//                settingsManager.exportProgress();
//            });
//        }
//
//        // 导入数据按钮点击事件
//        const importButton = document.getElementById('import-data');
//        if (importButton) {
//            importButton.addEventListener('click', () => {
//                const input = document.createElement('input');
//                input.type = 'file';
//                input.accept = '.json';
//                input.onchange = (e) => {
//                    const file = e.target.files[0];
//                    if (file) {
//                        settingsManager.importProgress(file);
//                    }
//                };
//                input.click();
//            });
//        }
//
//        // 重置数据按钮点击事件
//        const resetButton = document.getElementById('reset-data');
//        if (resetButton) {
//            resetButton.addEventListener('click', () => {
//                settingsManager.resetProgress();
//            });
//        }
//
//        // 设置默认选中的每日词数
//        const savedCount = settingsManager.getDailyWordsCount();
//        const defaultButton = document.querySelector(`.daily-words-btn[data-count="${savedCount}"]`);
//        if (defaultButton) {
//            defaultButton.classList.remove('border');
//            defaultButton.classList.add('bg-blue-600', 'text-white');
//        }
//    } catch (error) {
//        console.error('初始化设置页面失败:', error);
//    }
//}
//
//// 处理卡片响应
//async function handleCardResponse(response, wordIndex) {
//    const currentWord = vocabularyData.getAllWords()[wordIndex];
//    if (!currentWord) return;
//
//    // 应用间隔重复算法
//    const updatedWord = spacedRepetition.processResponse(currentWord, response);
//
//    // 保存更新后的词语
//    await vocabularyStorage.saveWord(updatedWord);
//
//    // 更新词库数据
//    vocabularyData.loadWords();
//
//    // 显示下一张卡片
//    cardUI.showNextCard();
//}
//
//// 设置卡片交互
//function setupCardInteraction() {
//    // 使用事件委托处理所有卡片按钮点击
//    document.addEventListener('click', (e) => {
//        // 处理学习页面的卡片按钮
//        if (e.target.closest('.card') && e.target.tagName === 'BUTTON') {
//            const learningContainer = document.getElementById('learning-container');
//            if (learningContainer) {
//                const card = e.target.closest('.card');
//                const wordIndex = Array.from(learningContainer.children).indexOf(card);
//
//                // 使用cardUI的handleCardResponse方法
//                if (window.cardUI && window.cardUI.handleCardResponse) {
//                    window.cardUI.handleCardResponse(e.target.textContent, wordIndex);
//                } else {
//                    // fallback到全局函数
//                    handleCardResponse(e.target.textContent, wordIndex);
//                }
//            }
//        }
//
//        // 处理返回首页按钮
//        if (e.target.id === 'back-to-home') {
//            switchPage('home');
//            updateHomeStats();
//        }
//    });
//}
//
//// 更新首页统计
//async function updateHomeStats() {
//    const stats = vocabularyData.getStats();
//    const totalWords = stats.mastered + stats.learning + stats.unlearned;
//    const progressPercentage = totalWords > 0 ? Math.round((stats.mastered / totalWords) * 100) : 0;
//
//    const homePage = document.getElementById('home-page');
//    if (homePage) {
//        // 更新今日任务数量
//        const newWordsElement = homePage.querySelector('#new-words-count');
//        const reviewWordsElement = homePage.querySelector('#review-words-count');
//
//        // 更新学习进度
//        const masteredElement = homePage.querySelector('#mastered-count');
//        const learningElement = homePage.querySelector('#learning-count');
//        const unlearnedElement = homePage.querySelector('#unlearned-count');
//        const progressPercentageElement = homePage.querySelector('#progress-percentage');
//        const totalWordsElement = homePage.querySelector('#total-words');
//
//        // 更新环形图
//        const progressCircle = homePage.querySelector('svg path[stroke="#3b82f6"]');
//        if (progressCircle) {
//            progressCircle.setAttribute('stroke-dasharray', `${progressPercentage}, 100`);
//        }
//
//        // 更新文本内容
//        if (newWordsElement) newWordsElement.textContent = stats.unlearned;
//        if (reviewWordsElement) reviewWordsElement.textContent = stats.learning;
//        if (masteredElement) masteredElement.textContent = stats.mastered;
//        if (learningElement) learningElement.textContent = stats.learning;
//        if (unlearnedElement) unlearnedElement.textContent = stats.unlearned;
//        if (progressPercentageElement) progressPercentageElement.textContent = `${progressPercentage}%`;
//        if (totalWordsElement) totalWordsElement.textContent = totalWords;
//    }
//}
//
//// 开始学习按钮点击事件
//function setupStartLearningButton() {
//    const startButton = document.getElementById('start-learning');
//    if (startButton) {
//        startButton.addEventListener('click', () => {
//            switchPage('learning');
//            initLearningPage();
//        });
//    }
//}
//
//// 注册 Service Worker
//async function registerServiceWorker() {
//    if ('serviceWorker' in navigator) {
//        try {
//            const registration = await navigator.serviceWorker.register('/sw.js');
//            console.log('Service Worker 注册成功:', registration.scope);
//
//            // 等待 Service Worker 激活
//            if (registration.active) {
//                console.log('Service Worker 已激活');
//            }
//
//            // 监听更新
//            registration.addEventListener('updatefound', () => {
//                const installingWorker = registration.installing;
//                installingWorker.addEventListener('statechange', () => {
//                    if (installingWorker.state === 'activated') {
//                        console.log('新 Service Worker 已激活');
//                    }
//                });
//            });
//
//            // 检查是否支持PWA安装
//            if ('launchQueue' in window || 'standalone' in navigator) {
//                console.log('设备支持PWA安装');
//            }
//
//        } catch (error) {
//            console.error('Service Worker 注册失败:', error);
//        }
//    } else {
//        console.log('浏览器不支持 Service Worker');
//    }
//}
//
//// Base64 转 Uint8Array
//function urlBase64ToUint8Array(base64String) {
//    const padding = '='.repeat((4 - base64String.length % 4) % 4);
//    const base64 = (base64String + padding)
//        .replace(/\-/g, '+')
//        .replace(/_/g, '/');
//
//    const rawData = window.atob(base64);
//    const outputArray = new Uint8Array(rawData.length);
//
//    for (let i = 0; i < rawData.length; ++i) {
//        outputArray[i] = rawData.charCodeAt(i);
//    }
//
//    return outputArray;
//}
//
//// 检查是否需要显示安装提示
//function checkInstallPrompt() {
//    let deferredPrompt;
//    const installButton = document.getElementById('install-button');
//
//    window.addEventListener('beforeinstallprompt', (e) => {
//        e.preventDefault();
//        deferredPrompt = e;
//
//        // 显示安装按钮
//        if (installButton) {
//            installButton.style.display = 'block';
//        } else {
//            // 如果没有安装按钮，创建一个
//            const newInstallBtn = document.createElement('button');
//            newInstallBtn.id = 'install-button';
//            newInstallBtn.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
//            newInstallBtn.textContent = '安装到桌面';
//            document.body.appendChild(newInstallBtn);
//
//            newInstallBtn.addEventListener('click', () => {
//                deferredPrompt.prompt();
//                deferredPrompt.userChoice.then((choiceResult) => {
//                    if (choiceResult.outcome === 'accepted') {
//                        console.log('用户接受了安装提示');
//                    } else {
//                        console.log('用户拒绝了安装提示');
//                    }
//                    deferredPrompt = null;
//                });
//            });
//        }
//    });
//
//    // 检测是否已安装
//    if (window.matchMedia('(display-mode: standalone)').matches ||
//        window.navigator.standalone === true) {
//        console.log('应用已安装');
//        return;
//    }
//
//    // 监听安装模式变化
//    window.addEventListener('appinstalled', () => {
//        console.log('应用已安装到桌面');
//        if (installButton) {
//            installButton.style.display = 'none';
//        }
//    });
//}
//
//// 初始化应用
//document.addEventListener('DOMContentLoaded', async () => {
//    try {
//        // 注册 Service Worker
//        registerServiceWorker();
//
//        // 检查安装提示
//        checkInstallPrompt();
//
//        // 初始化数据库
//        await vocabularyStorage.initDB();
//
//        // 初始化词库（如果首次使用）
//        const words = await vocabularyData.loadWords();
//        await vocabularyStorage.initializeVocabulary(words);
//
//        // 渲染词库列表
//        renderVocabularyList();
//
//        // 设置搜索功能
//        setupSearch();
//
//        // 设置筛选功能
//        setupFilterButtons();
//
//        // 设置开始学习按钮
//        setupStartLearningButton();
//
//        // 设置卡片交互
//        setupCardInteraction();
//
//        // 更新首页统计
//        await updateHomeStats();
//
//        console.log('应用初始化完成');
//
//        // 修复移动端导航栏样式问题
//        fixMobileNavigation();
//    } catch (error) {
//        console.error('应用初始化失败:', error);
//    }
//});
//
//// 修复移动端导航栏样式
//function fixMobileNavigation() {
//    // 确保body有正确的padding
//    if (window.innerWidth <= 768) {
//        document.body.style.paddingBottom = '70px';
//
//        // 确保每个页面有正确的最小高度
//        document.querySelectorAll('.page').forEach(page => {
//            page.style.minHeight = `calc(100vh - 70px)`;
//        });
//
//        // 修复导航栏样式
//        const nav = document.querySelector('nav');
//        if (nav) {
//            nav.style.position = 'fixed';
//            nav.style.bottom = '0';
//            nav.style.left = '0';
//            nav.style.right = '0';
//            nav.style.zIndex = '1000';
//            nav.style.height = '60px';
//            nav.style.backgroundColor = 'white';
//            nav.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
//        }
//
//        // 修复主内容区域
//        const app = document.getElementById('app');
//        if (app) {
//            app.style.paddingBottom = '70px';
//            app.style.minHeight = 'calc(100vh - 70px)';
//        }
//    }
//}
//
//// 窗口大小改变时重新修复导航栏
//window.addEventListener('resize', () => {
//    // 防抖处理
//    clearTimeout(window.resizeTimeout);
//    window.resizeTimeout = setTimeout(() => {
//        fixMobileNavigation();
//    }, 250);
//});




// ============================================================
// 公考词语记忆卡 — 主应用逻辑（自包含版，无外部 import 依赖）
// ============================================================

// ── 全局状态 ──────────────────────────────────────────────
const AppState = {
  words: [],          // 完整词库（从 words.json 加载）
  progress: {},       // { wordId: { status, nextReview, interval, easeFactor, reviewCount } }
  settings: { dailyCount: 20, darkMode: false },
  streak: 0,
  session: { queue: [], currentIndex: 0, flipped: false },
  currentPage: 'home',
  filter: 'all',
  searchQuery: '',
};

// ── IndexedDB 存储 ─────────────────────────────────────────
const DB_NAME = 'vocab_app';
const DB_VERSION = 1;
let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('progress'))
        d.createObjectStore('progress', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('settings'))
        d.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}

function dbGet(store, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(store, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(value);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbGetAll(store) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveProgress(wordId, data) {
  AppState.progress[wordId] = data;
  await dbPut('progress', { id: wordId, ...data });
}

async function loadAllProgress() {
  const rows = await dbGetAll('progress');
  rows.forEach(r => {
    const { id, ...rest } = r;
    AppState.progress[id] = rest;
  });
}

async function saveSetting(key, value) {
  await dbPut('settings', { key, value });
}

async function loadSettings() {
  const daily = await dbGet('settings', 'dailyCount');
  const dark  = await dbGet('settings', 'darkMode');
  const streak = await dbGet('settings', 'streak');
  const streakDate = await dbGet('settings', 'streakDate');

  if (daily)  AppState.settings.dailyCount = daily.value;
  if (dark)   AppState.settings.darkMode   = dark.value;

  // 连续天数计算
  const today = todayStr();
  if (streakDate && streakDate.value === today) {
    AppState.streak = streak ? streak.value : 0;
  } else if (streakDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (streakDate.value === yStr) {
      AppState.streak = streak ? streak.value : 0;
    } else {
      AppState.streak = 0;
      await saveSetting('streak', 0);
    }
  }
}

// ── 工具函数 ───────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getWordProgress(wordId) {
  return AppState.progress[wordId] || {
    status: 'new',
    nextReview: todayStr(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0,
  };
}

// SM-2 间隔重复算法
function sm2(prog, quality) {
  // quality: 0=完全不会, 1=很难, 2=有点难, 3=简单
  let { interval, easeFactor, reviewCount } = prog;
  reviewCount += 1;
  if (quality < 2) {
    interval = 1;
  } else {
    if (reviewCount === 1) interval = 1;
    else if (reviewCount === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
  const next = new Date();
  next.setDate(next.getDate() + interval);
  const status = easeFactor >= 2.5 && reviewCount >= 3 ? 'mastered'
               : reviewCount >= 1 ? 'learning' : 'new';
  return {
    status,
    nextReview: next.toISOString().slice(0, 10),
    interval,
    easeFactor,
    reviewCount,
  };
}

function getStats() {
  let mastered = 0, learning = 0, unlearned = 0;
  AppState.words.forEach(w => {
    const p = getWordProgress(w.id);
    if (p.status === 'mastered') mastered++;
    else if (p.status === 'learning') learning++;
    else unlearned++;
  });
  return { mastered, learning, unlearned, total: AppState.words.length };
}

function getTodayQueue() {
  const today = todayStr();
  // 今日待复习
  const review = AppState.words.filter(w => {
    const p = getWordProgress(w.id);
    return p.status !== 'new' && p.nextReview <= today;
  });
  // 今日新词（按顺序取，未学过的）
  const newWords = AppState.words
    .filter(w => getWordProgress(w.id).status === 'new')
    .slice(0, AppState.settings.dailyCount);
  return [...review, ...newWords];
}

// ── 词库加载 ───────────────────────────────────────────────
//async function loadWords() {
//  try {
//    let data;
//
//    // 5+ App 环境：使用 XMLHttpRequest 读取本地文件
//    if (typeof plus !== 'undefined' && plus.io) {
//      data = await new Promise((resolve, reject) => {
//        const xhr = new XMLHttpRequest();
//        xhr.open('GET', '_www/data/words.json', true);  // 5+App 中 _www 是应用根目录
//        xhr.onload = () => {
//          if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
//          else reject(new Error('HTTP ' + xhr.status));
//        };
//        xhr.onerror = () => reject(new Error('XHR error'));
//        xhr.send();
//      });
//    } else {
//      // 浏览器环境：使用 fetch
//      const res = await fetch('./data/words.json');
//      data = await res.json();
//    }
//
//    if (Array.isArray(data)) {
//      AppState.words = data.map((w, i) => ({ id: w.id || `w${i}`, ...w }));
//    } else if (data.words) {
//      AppState.words = data.words.map((w, i) => ({ id: w.id || `w${i}`, ...w }));
//    } else {
//      let words = [];
//      Object.entries(data).forEach(([group, arr]) => {
//        if (Array.isArray(arr)) {
//          arr.forEach((w, i) => words.push({ id: w.id || `${group}_${i}`, group, ...w }));
//        }
//      });
//      AppState.words = words;
//    }
//    console.log(`✅ 词库加载成功：${AppState.words.length} 个词`);
//  } catch (e) {
//    console.warn('⚠️ words.json 加载失败，使用示例数据', e);
//    AppState.words = [
//      { id: 'w1', word: '筚路蓝缕', pinyin: 'bì lù lán lǚ', meaning: '形容创业的艰苦', group: '第1组', type: '成语' },
//      { id: 'w2', word: '鞭辟入里', pinyin: 'biān pì rù lǐ', meaning: '分析透彻，切中要害', group: '第1组', type: '成语' },
//      { id: 'w3', word: '相得益彰', pinyin: 'xiāng dé yì zhāng', meaning: '互相配合，更显出各自的优点', group: '第1组', type: '成语' },
//      { id: 'w4', word: '付诸实践', pinyin: 'fù zhū shí jiàn', meaning: '把理论转化为实际行动', group: '第2组', type: '实词' },
//      { id: 'w5', word: '统筹兼顾', pinyin: 'tǒng chóu jiān gù', meaning: '全面安排，照顾到各方面', group: '第2组', type: '成语' },
//    ];
//  }
//}
async function loadWords() {
  if (window.WORDS_DATA && window.WORDS_DATA.length > 0) {
    AppState.words = window.WORDS_DATA.map((w, i) => ({
      id: w.id || `w${i}`, ...w
    }));
    console.log(`✅ 词库加载成功：${AppState.words.length} 个词`);
    return;
  }
  // fallback：浏览器开发环境用 fetch
  try {
    const res = await fetch('./data/words.json');
    const data = await res.json();
    AppState.words = data.map((w, i) => ({ id: w.id || `w${i}`, ...w }));
    console.log(`✅ fetch 加载成功：${AppState.words.length} 个词`);
  } catch (e) {
    console.error('词库加载失败', e);
    AppState.words = [];
  }
}

// ── 页面路由 ───────────────────────────────────────────────
function switchPage(pageId) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => {
    p.classList.add('hidden');
    p.classList.remove('visible');
  });
  // 显示目标页面
  const target = document.getElementById(`${pageId}-page`);
  if (!target) { console.error('页面不存在:', pageId); return; }
  target.classList.remove('hidden');
  target.classList.add('visible');

  // 更新导航高亮
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-page') === pageId;
    btn.classList.toggle('text-blue-600', isActive);
    btn.classList.toggle('text-gray-400', !isActive);
  });

  AppState.currentPage = pageId;

  // 初始化页面内容
  if (pageId === 'home')       renderHomePage();
  if (pageId === 'vocabulary') renderVocabularyPage();
  if (pageId === 'stats')      renderStatsPage();
  if (pageId === 'settings')   renderSettingsPage();
}

// ── 首页 ───────────────────────────────────────────────────
function renderHomePage() {
  // 日期
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  }

  const stats = getStats();
  const queue = getTodayQueue();
  const newCount   = queue.filter(w => getWordProgress(w.id).status === 'new').length;
  const revCount   = queue.filter(w => getWordProgress(w.id).status !== 'new').length;
  const pct = stats.total > 0 ? Math.round(stats.mastered / stats.total * 100) : 0;

  setText('new-words-count', newCount);
  setText('review-words-count', revCount);
  setText('mastered-count', stats.mastered);
  setText('learning-count', stats.learning);
  setText('unlearned-count', stats.unlearned);
  setText('progress-percentage', `${pct}%`);
  setText('total-words', stats.total);
  setText('streak-days', AppState.streak);

  // 环形进度
  const circle = document.getElementById('progress-circle');
  if (circle) circle.setAttribute('stroke-dasharray', `${pct}, 100`);
}

// ── 词库页面 ────────────────────────────────────────────────
function renderVocabularyPage() {
  const list = document.getElementById('vocabulary-list');
  if (!list) return;

  const q = AppState.searchQuery.trim().toLowerCase();
  let words = AppState.words;

  if (q) words = words.filter(w =>
    (w.word && w.word.includes(q)) ||
    (w.pinyin && w.pinyin.toLowerCase().includes(q)) ||
    (w.meaning && w.meaning.includes(q))
  );

  if (AppState.filter !== 'all') {
    words = words.filter(w => getWordProgress(w.id).status === AppState.filter);
  }

  if (words.length === 0) {
    list.innerHTML = `<div class="p-8 text-center text-gray-400">没有找到词语</div>`;
    return;
  }

  list.innerHTML = words.map(w => {
    const p = getWordProgress(w.id);
    const statusMap = {
      new:      ['bg-gray-100 text-gray-600', '未学习'],
      learning: ['bg-blue-100 text-blue-700', '学习中'],
      mastered: ['bg-green-100 text-green-700', '已掌握'],
    };
    const [cls, label] = statusMap[p.status] || statusMap.new;
    return `
      <div class="p-3 flex justify-between items-start hover:bg-gray-50 cursor-pointer"
           onclick="showWordDetail('${w.id}')">
        <div class="flex-1 min-w-0">
          <div class="flex items-baseline gap-2">
            <span class="font-semibold text-base">${w.word || ''}</span>
            <span class="text-xs text-gray-400">${w.pinyin || ''}</span>
          </div>
          <p class="text-sm text-gray-500 mt-0.5 truncate">${w.meaning || ''}</p>
        </div>
        <span class="ml-2 px-2 py-0.5 rounded-full text-xs shrink-0 ${cls}">${label}</span>
      </div>`;
  }).join('');
}

function showWordDetail(wordId) {
  const w = AppState.words.find(x => x.id === wordId);
  if (!w) return;
  const p = getWordProgress(wordId);
  alert(`【${w.word}】\n${w.pinyin || ''}\n\n${w.meaning || ''}\n\n状态：${
    p.status === 'mastered' ? '已掌握' : p.status === 'learning' ? '学习中' : '未学习'
  }`);
}

// ── 统计页面 ────────────────────────────────────────────────
function renderStatsPage() {
  const stats = getStats();
  const pct = stats.total > 0 ? Math.round(stats.mastered / stats.total * 100) : 0;

  setText('stats-progress-pct', `${pct}%`);
  setText('stats-mastered', stats.mastered);
  setText('stats-learning', stats.learning);
  setText('stats-unlearned', stats.unlearned);
  setText('stats-streak', AppState.streak);
  setText('stats-total-learned', stats.mastered + stats.learning);

  // 环形
  const c = document.getElementById('stats-progress-circle');
  if (c) c.setAttribute('stroke-dasharray', `${pct}, 100`);

  // 分组完成度
  renderGroupProgress();

  // 7天图表（用学习记录模拟）
  renderWeeklyChart();
}

function renderGroupProgress() {
  const el = document.getElementById('group-progress-list');
  if (!el) return;

  const groups = {};
  AppState.words.forEach(w => {
    const g = w.group || '其他';
    if (!groups[g]) groups[g] = { total: 0, mastered: 0 };
    groups[g].total++;
    if (getWordProgress(w.id).status === 'mastered') groups[g].mastered++;
  });

  el.innerHTML = Object.entries(groups).map(([g, { total, mastered }]) => {
    const pct = total > 0 ? Math.round(mastered / total * 100) : 0;
    return `
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-700">${g}</span>
          <span class="text-gray-500">${pct}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

function renderWeeklyChart() {
  const svg = document.getElementById('weekly-chart');
  if (!svg) return;

  // 生成最近7天日期标签和模拟数据
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ label: `${d.getMonth()+1}/${d.getDate()}`, date: d.toISOString().slice(0,10) });
  }

  // 从 progress 里统计每天复习数（用 nextReview 倒推）
  const counts = days.map(({ date }) => {
    // 简单统计：该日期前已完成复习的词数
    const n = Object.values(AppState.progress).filter(p =>
      p.nextReview && p.nextReview >= date && p.reviewCount > 0
    ).length;
    return Math.min(n, 50);
  });

  const maxC = Math.max(...counts, 1);
  const W = 280, H = 100, PAD_L = 20, PAD_R = 10, PAD_T = 10, PAD_B = 25;
  const cW = W - PAD_L - PAD_R;
  const cH = H - PAD_T - PAD_B;
  const xs = days.map((_, i) => PAD_L + (i / (days.length - 1)) * cW);
  const ys = counts.map(c => PAD_T + cH - (c / maxC) * cH);

  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const areaPoints = `${xs[0]},${PAD_T+cH} ${points} ${xs[xs.length-1]},${PAD_T+cH}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <line x1="${PAD_L}" y1="${PAD_T+cH}" x2="${W-PAD_R}" y2="${PAD_T+cH}" stroke="#e5e7eb" stroke-width="1"/>
    <polygon points="${areaPoints}" fill="url(#areaGrad)"/>
    <polyline points="${points}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>
    ${xs.map((x, i) => `
      <circle cx="${x}" cy="${ys[i]}" r="3" fill="#3b82f6"/>
      <text x="${x}" y="${PAD_T+cH+15}" text-anchor="middle" font-size="9" fill="#9ca3af">${days[i].label}</text>
    `).join('')}
  `;
}

// ── 设置页面 ────────────────────────────────────────────────
function renderSettingsPage() {
  // 深色模式
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) toggle.checked = AppState.settings.darkMode;

  // 每日词数高亮
  const display = document.getElementById('daily-words-display');
  if (display) display.textContent = `当前：${AppState.settings.dailyCount} 词`;

  document.querySelectorAll('.daily-words-btn').forEach(btn => {
    const n = parseInt(btn.getAttribute('data-count'));
    const active = n === AppState.settings.dailyCount;
    btn.classList.toggle('bg-blue-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-blue-600', active);
  });
}

// ── 学习页面 ────────────────────────────────────────────────
function startLearningSession() {
  const queue = getTodayQueue();
  if (queue.length === 0) {
    alert('🎉 今日任务已完成！明天再来复习吧。');
    return;
  }
  AppState.session = { queue, currentIndex: 0, flipped: false };
  switchPage('learning');
  renderCurrentCard();
}

function renderCurrentCard() {
  const container = document.getElementById('learning-container');
  if (!container) return;

  const { queue, currentIndex } = AppState.session;
  const total = queue.length;

  setText('card-progress-text', `${currentIndex} / ${total}`);
  const bar = document.getElementById('session-progress-bar');
  if (bar) bar.style.width = `${total > 0 ? Math.round(currentIndex / total * 100) : 0}%`;

  if (currentIndex >= total) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">今日完成！</h2>
        <p class="text-gray-500 mb-6">共学习了 ${total} 个词语</p>
        <button id="btn-back-home"
          class="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700">
          返回首页
        </button>
      </div>`;
    document.getElementById('btn-back-home')
      .addEventListener('click', () => switchPage('home'));
    updateStreak();
    return;
  }

  const word = queue[currentIndex];
  const prog = getWordProgress(word.id);
  const isNew = prog.status === 'new';
  setText('session-mode-label', isNew ? '新词' : '复习');

  // ── 渲染卡片 HTML（不含任何 onclick）──
  container.innerHTML = `
    <div id="flashcard" style="cursor:pointer; user-select:none;">
      <div id="card-front"
           class="bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col justify-center"
           style="min-height:280px;">
        <div class="text-xs text-gray-400 mb-4 uppercase tracking-wider">
          ${word.type || ''} · ${word.group || ''}
        </div>
        <h2 class="text-4xl font-bold text-gray-800 mb-3">${word.word || ''}</h2>
        <p class="text-gray-400 text-lg mb-4">${word.pinyin || ''}</p>
        <p class="text-sm text-gray-300 mt-4">点击卡片翻转查看释义 👆</p>
      </div>

      <div id="card-back"
           class="hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 text-center flex flex-col justify-between"
           style="min-height:280px;">
        <div>
          <div class="text-xs text-gray-400 mb-2">${word.type || ''} · ${word.group || ''}</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-2">${word.word || ''}</h2>
          <p class="text-blue-500 mb-4">${word.pinyin || ''}</p>
          <div class="bg-white rounded-xl p-4 text-left shadow-sm">
            <p class="text-gray-700 leading-relaxed">${word.meaning || '暂无释义'}</p>
          </div>
          <!-- 例句显示区域 -->
          ${word.examples && word.examples.length > 0 ? `
            <div class="bg-blue-50 rounded-xl p-4 text-left shadow-sm mt-4">
              <p class="text-xs text-blue-600 mb-2 font-semibold">例句</p>
              ${word.examples.map(example => `
                <p class="text-sm text-gray-700 leading-relaxed italic">"${example}"</p>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="grid grid-cols-2 gap-2 mt-6" id="rate-buttons">
          <button data-q="0"
            class="rate-btn py-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium">
            😵 完全不会
          </button>
          <button data-q="1"
            class="rate-btn py-3 rounded-xl bg-orange-100 text-orange-700 text-sm font-medium">
            😓 很难
          </button>
          <button data-q="2"
            class="rate-btn py-3 rounded-xl bg-yellow-100 text-yellow-700 text-sm font-medium">
            🤔 有点难
          </button>
          <button data-q="3"
            class="rate-btn py-3 rounded-xl bg-green-100 text-green-700 text-sm font-medium">
            😊 轻松
          </button>
        </div>
      </div>
    </div>`;

  AppState.session.flipped = false;

  // ── 用 addEventListener 绑定，比 onclick 属性可靠 ──
  const flashcard = document.getElementById('flashcard');

  flashcard.addEventListener('click', function(e) {
    // 如果点的是评分按钮，不触发翻转
    if (e.target.closest('.rate-btn')) return;
    if (AppState.session.flipped) return;
    // 翻转
    document.getElementById('card-front').classList.add('hidden');
    document.getElementById('card-back').classList.remove('hidden');
    AppState.session.flipped = true;
  });

  document.querySelectorAll('.rate-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.stopPropagation();
      const quality = parseInt(this.getAttribute('data-q'));
      const w = queue[AppState.session.currentIndex];
      const p = getWordProgress(w.id);
      const updated = sm2(p, quality);
      await saveProgress(w.id, updated);
      AppState.session.currentIndex++;
      renderCurrentCard();
    });
  });
}

//function flipCard() {
//  if (AppState.session.flipped) return;
//  const front = document.getElementById('card-front');
//  const back  = document.getElementById('card-back');
//  if (front) front.classList.add('hidden');
//  if (back)  back.classList.remove('hidden');
//  AppState.session.flipped = true;
//}

//async function rateWord(e, quality) {
//  e.stopPropagation();
//  const { queue, currentIndex } = AppState.session;
//  const word = queue[currentIndex];
//  const prog = getWordProgress(word.id);
//  const updated = sm2(prog, quality);
//  await saveProgress(word.id, updated);
//  AppState.session.currentIndex++;
//  renderCurrentCard();
//}

async function updateStreak() {
  const today = todayStr();
  const lastStudy = await dbGet('settings', 'streakDate');
  if (!lastStudy || lastStudy.value !== today) {
    AppState.streak += 1;
    await saveSetting('streak', AppState.streak);
    await saveSetting('streakDate', today);
  }
}

// ── 事件绑定 ───────────────────────────────────────────────
function bindEvents() {
  // 底部导航
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      switchPage(page);
    });
  });

  // 开始学习
  const startBtn = document.getElementById('start-learning');
  if (startBtn) startBtn.addEventListener('click', startLearningSession);

  // 返回按钮（学习页）
  const backBtn = document.getElementById('back-from-learning');
  if (backBtn) backBtn.addEventListener('click', () => switchPage('home'));

  // 搜索
  const searchInput = document.getElementById('vocab-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      AppState.searchQuery = e.target.value;
      renderVocabularyPage();
    });
  }

  // 词库筛选
  document.querySelectorAll('.vocab-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.vocab-filter-btn').forEach(b => {
        b.classList.toggle('bg-blue-600', b === btn);
        b.classList.toggle('text-white', b === btn);
        b.classList.toggle('bg-gray-200', b !== btn);
        b.classList.toggle('text-gray-700', b !== btn);
      });
      renderVocabularyPage();
    });
  });

  // 深色模式
  const darkToggle = document.getElementById('dark-mode-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('change', async e => {
      AppState.settings.darkMode = e.target.checked;
      document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : '');
      await saveSetting('darkMode', e.target.checked);
    });
  }

  // 每日词数
  document.querySelectorAll('.daily-words-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      AppState.settings.dailyCount = parseInt(btn.getAttribute('data-count'));
      await saveSetting('dailyCount', AppState.settings.dailyCount);
      renderSettingsPage();
    });
  });

  // 导出进度
  const exportBtn = document.getElementById('export-data');
  if (exportBtn) exportBtn.addEventListener('click', exportData);

  // 导入进度
  const importBtn = document.getElementById('import-data');
  if (importBtn) importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => importData(e.target.files[0]);
    input.click();
  });

  // 重置
  const resetBtn = document.getElementById('reset-data');
  if (resetBtn) resetBtn.addEventListener('click', resetData);
}

// ── 数据管理 ───────────────────────────────────────────────
function exportData() {
  const blob = new Blob([JSON.stringify({
    progress: AppState.progress,
    settings: AppState.settings,
    streak: AppState.streak,
    exportDate: new Date().toISOString(),
  }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vocab_progress_${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.progress) {
        AppState.progress = data.progress;
        for (const [id, prog] of Object.entries(data.progress)) {
          await dbPut('progress', { id, ...prog });
        }
      }
      if (data.settings) {
        AppState.settings = { ...AppState.settings, ...data.settings };
        await saveSetting('dailyCount', AppState.settings.dailyCount);
        await saveSetting('darkMode', AppState.settings.darkMode);
      }
      alert('✅ 导入成功！');
      renderHomePage();
    } catch {
      alert('❌ 文件格式错误');
    }
  };
  reader.readAsText(file);
}

async function resetData() {
  if (!confirm('确认重置所有学习进度？此操作不可撤销。')) return;
  AppState.progress = {};
  AppState.streak = 0;
  const tx = db.transaction('progress', 'readwrite');
  tx.objectStore('progress').clear();
  await new Promise(r => { tx.oncomplete = r; });
  alert('✅ 已重置');
  renderHomePage();
}

// ── 工具 ───────────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ── 应用初始化 ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await openDB();
    await loadSettings();
    await loadAllProgress();
    await loadWords();

    // 深色模式恢复
    if (AppState.settings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    bindEvents();
    switchPage('home');

    // PWA Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    // PWA 安装提示
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      const btn = document.getElementById('install-button');
      if (btn) {
        btn.style.display = 'block';
        btn.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt = null;
          btn.style.display = 'none';
        });
      }
    });

    console.log('✅ 应用初始化完成');
  } catch (err) {
    console.error('❌ 初始化失败:', err);
  }
});