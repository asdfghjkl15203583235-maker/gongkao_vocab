// 间隔重复算法 (SM-2 简化版)
class SpacedRepetition {
    constructor() {
        this.easeFactor = 2.5; // 初始难度系数
    }

    // 计算下次复习日期
    calculateNextReviewDate(interval) {
        const today = new Date();
        const nextReview = new Date(today);
        nextReview.setDate(today.getDate() + interval);
        return nextReview.toISOString().split('T')[0];
    }

    // 处理用户反馈
    processResponse(currentWord, response) {
        let newInterval = currentWord.interval;
        let newEaseFactor = currentWord.easeFactor;

        switch (response) {
            case '不认识':
                newInterval = 1;
                newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
                break;
            case '模糊':
                newInterval = Math.max(1, Math.round(newInterval * 1.2));
                break;
            case '认识':
                newInterval = Math.round(newInterval * newEaseFactor);
                newEaseFactor += 0.1;
                break;
        }

        // 更新词语状态
        let newStatus = currentWord.status;
        if (currentWord.status === 'new') {
            newStatus = 'learning';
        } else if (newInterval >= 21 && currentWord.reviewCount >= 3) {
            newStatus = 'mastered';
        }

        // 更新复习次数
        const newReviewCount = currentWord.reviewCount + 1;

        return {
            ...currentWord,
            interval: newInterval,
            easeFactor: newEaseFactor,
            nextReview: this.calculateNextReviewDate(newInterval),
            status: newStatus,
            reviewCount: newReviewCount,
            lastReview: new Date().toISOString().split('T')[0]
        };
    }

    // 获取今日需要复习的词语
    getTodayReviews(words) {
        const today = new Date().toISOString().split('T')[0];
        return words.filter(word => word.nextReview <= today && word.status !== 'mastered');
    }

    // 获取今日需要学习的新词
    getTodayNewWords(words, dailyNewCount = 80) {
        const unlearned = words.filter(word => word.status === 'new');
        return unlearned.slice(0, dailyNewCount);
    }
}

// 导出实例
const spacedRepetition = new SpacedRepetition();
export default spacedRepetition;