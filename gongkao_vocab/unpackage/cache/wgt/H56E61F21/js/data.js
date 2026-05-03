// 词库数据管理
class VocabularyData {
    constructor() {
        this.words = [];
        this.filteredWords = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
    }

    // 加载词库数据
    async loadWords() {
        try {
            const response = await fetch('data/words.json');
            this.words = await response.json();
            this.filteredWords = [...this.words];
            return this.words;
        } catch (error) {
            console.error('加载词库数据失败:', error);
            return [];
        }
    }

    // 获取所有词语
    getAllWords() {
        return this.words;
    }

    // 按状态筛选词语
    filterByStatus(status) {
        this.currentFilter = status;
        if (status === 'all') {
            this.filteredWords = [...this.words];
        } else {
            this.filteredWords = this.words.filter(word => word.status === status);
        }
        this.applySearch();
    }

    // 搜索词语
    search(term) {
        this.searchTerm = term;
        this.applySearch();
    }

    // 应用搜索和筛选
    applySearch() {
        let filtered = this.words;

        // 应用状态筛选
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(word => word.status === this.currentFilter);
        }

        // 应用搜索
        if (this.searchTerm) {
            filtered = filtered.filter(word =>
                word.word.includes(this.searchTerm) ||
                word.pinyin.includes(this.searchTerm) ||
                word.meaning.includes(this.searchTerm)
            );
        }

        this.filteredWords = filtered;
    }

    // 获取词语统计
    getStats() {
        const total = this.words.length;
        const mastered = this.words.filter(w => w.status === 'mastered').length;
        const learning = this.words.filter(w => w.status === 'learning').length;
        const unlearned = this.words.filter(w => w.status === 'new').length;

        return {
            total,
            mastered,
            learning,
            unlearned
        };
    }
}

// 导出实例
const vocabularyData = new VocabularyData();
export default vocabularyData;