// 设置页面功能管理
class SettingsManager {
    constructor() {
        this.dailyWordsCount = 20; // 默认每日新词数量
        this.isDarkMode = false; // 默认浅色模式
    }

    // 设置每日新词数量
    setDailyWordsCount(count) {
        this.dailyWordsCount = count;
        localStorage.setItem('dailyWordsCount', count);
        console.log(`每日新词数量设置为: ${count}`);
    }

    // 获取每日新词数量
    getDailyWordsCount() {
        const saved = localStorage.getItem('dailyWordsCount');
        return saved ? parseInt(saved) : this.dailyWordsCount;
    }

    // 切换深色模式
    toggleDarkMode(isDark) {
        this.isDarkMode = isDark;
        localStorage.setItem('darkMode', isDark);

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        console.log(`深色模式: ${isDark ? '开启' : '关闭'}`);
    }

    // 获取深色模式状态
    getDarkMode() {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : this.isDarkMode;
    }

    // 导出学习进度
    async exportProgress() {
        try {
            const words = await vocabularyData.getAllWords();
            const dataStr = JSON.stringify(words, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `vocabulary-progress-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('学习进度导出成功！');
        } catch (error) {
            console.error('导出学习进度失败:', error);
            alert('导出学习进度失败，请重试。');
        }
    }

    // 导入学习进度
    async importProgress(file) {
        try {
            const text = await file.text();
            const words = JSON.parse(text);

            // 验证数据格式
            if (!Array.isArray(words)) {
                throw new Error('无效的数据格式');
            }

            // 保存数据
            await vocabularyStorage.saveWords(words);
            vocabularyData.loadWords();

            alert('学习进度导入成功！');
            // 刷新相关页面
            updateHomeStats();
        } catch (error) {
            console.error('导入学习进度失败:', error);
            alert('导入学习进度失败，请检查文件格式。');
        }
    }

    // 重置所有进度
    async resetProgress() {
        if (confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
            try {
                // 获取原始词库数据
                const originalWords = await vocabularyData.loadWords();

                // 重置学习进度
                const wordsWithProgress = originalWords.map((word, index) => ({
                    ...word,
                    wordId: index + 1,
                    status: 'new',
                    interval: 0,
                    easeFactor: 2.5,
                    nextReview: new Date().toISOString().split('T')[0],
                    reviewCount: 0,
                    lastReview: ''
                }));

                // 保存重置后的数据
                await vocabularyStorage.saveWords(wordsWithProgress);
                vocabularyData.loadWords();

                alert('所有进度已重置！');
                // 刷新相关页面
                updateHomeStats();
            } catch (error) {
                console.error('重置进度失败:', error);
                alert('重置进度失败，请重试。');
            }
        }
    }
}

// 导出实例
const settingsManager = new SettingsManager();
export default settingsManager;