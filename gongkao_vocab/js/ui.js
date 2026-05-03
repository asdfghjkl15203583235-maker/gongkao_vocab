// 卡片组件和交互
class CardUI {
    constructor() {
        this.currentCardIndex = 0;
        this.cards = [];
        this.isFlipped = false;
        this.totalCards = 0;
        this.reviewedCards = 0;
        this.newCards = 0;
    }

    // 创建卡片元素
    createCard(word) {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front bg-white rounded-lg shadow-lg p-8">
                    <h2 class="text-4xl font-bold text-center mb-2">${word.word}</h2>
                    <p class="text-xl text-gray-500 text-center">${word.pinyin}</p>
                </div>
                <div class="card-back bg-white rounded-lg shadow-lg p-6">
                    <div class="text-left">
                        <p class="text-lg mb-4">${word.meaning}</p>
                        <div class="flex gap-2 mb-4">
                            ${word.tags.map(tag => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="flex gap-2 mt-4">
                        <button class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">不认识</button>
                        <button class="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors">模糊</button>
                        <button class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">认识</button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    // 翻转卡片
    flipCard(card) {
        card.classList.toggle('flipped');
        this.isFlipped = !this.isFlipped;
    }

    // 初始化卡片交互
    initCardInteraction(card, wordIndex) {
        const cardElement = card.querySelector('.card-inner');

        // 点击翻转（注意：如果已经翻转到背面，点击按钮时不要触发翻转）
        cardElement.addEventListener('click', (e) => {
            // 如果点击的是按钮，不翻转卡片
            if (e.target.tagName === 'BUTTON') {
                return;
            }

            if (!this.isFlipped) {
                this.flipCard(card);
            }
        });

        // 按钮点击处理
        const buttons = card.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCardResponse(button.textContent, wordIndex);
            });
        });
    }

    // 处理卡片响应
    async handleCardResponse(response, wordIndex) {
        const currentWord = this.cards[wordIndex].wordData;
        if (!currentWord) return;

        // 应用间隔重复算法
        const updatedWord = spacedRepetition.processResponse(currentWord, response);

        // 保存更新后的词语
        await vocabularyStorage.saveWord(updatedWord);

        // 更新词库数据
        vocabularyData.loadWords();

        // 翻转回来
        if (this.isFlipped) {
            this.flipCard(this.cards[wordIndex]);
        }

        // 更新统计
        this.reviewedCards++;

        // 显示下一张卡片
        this.showNextCard();
    }

    // 显示下一张卡片
    showNextCard() {
        if (this.currentCardIndex < this.cards.length - 1) {
            this.currentCardIndex++;
            this.updateCardDisplay();
        } else {
            this.showCompletionMessage();
        }
    }

    // 更新卡片显示
    updateCardDisplay() {
        // 隐藏所有卡片
        this.cards.forEach(card => {
            card.classList.remove('card-slide-in');
            card.style.display = 'none';
        });

        // 显示当前卡片
        if (this.cards[this.currentCardIndex]) {
            this.cards[this.currentCardIndex].style.display = 'block';
            setTimeout(() => {
                this.cards[this.currentCardIndex].classList.add('card-slide-in');
            }, 10);
        }
    }

    // 显示完成消息
    showCompletionMessage() {
        const learningContainer = document.getElementById('learning-container');
        if (!learningContainer) return;

        learningContainer.innerHTML = `
            <div class="text-center p-8">
                <h2 class="text-3xl font-bold text-green-600 mb-4">今日学习完成！</h2>
                <p class="text-lg mb-2">已学习 ${this.reviewedCards} 个词语</p>
                <p class="text-gray-600">继续坚持，你会越来越棒！</p>
                <button id="back-to-home" class="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    返回首页
                </button>
            </div>
        `;

        // 返回首页按钮
        const backToHomeBtn = document.getElementById('back-to-home');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => {
                switchPage('home');
            });
        }
    }

    // 初始化学习页面
    initLearningPage(words) {
        const learningContainer = document.getElementById('learning-container');
        if (!learningContainer) return;

        // 清空容器
        learningContainer.innerHTML = '';

        // 重置统计
        this.currentCardIndex = 0;
        this.reviewedCards = 0;
        this.totalCards = words.length;

        // 创建卡片
        this.cards = words.map((word, index) => {
            const card = this.createCard(word);
            card.wordData = word; // 存储原始词语数据
            this.initCardInteraction(card, index);
            return card;
        });

        // 添加到容器
        this.cards.forEach(card => {
            learningContainer.appendChild(card);
        });

        // 显示第一张卡片
        this.updateCardDisplay();
    }
}

// 导出实例
const cardUI = new CardUI();
export default cardUI;