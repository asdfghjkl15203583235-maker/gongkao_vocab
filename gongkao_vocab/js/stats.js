// 统计页面数据管理
class StatsManager {
    constructor() {
        this.statsData = {
            totalProgress: 0,
            mastered: 0,
            learning: 0,
            unlearned: 0,
            recent7Days: [],
            groupProgress: {},
            consecutiveDays: 0,
            totalLearned: 0
        };
    }

    // 获取统计数据
    async getStatsData() {
        try {
            // 获取所有词语
            const words = await vocabularyData.getAllWords();
            const total = words.length;

            // 计算各项统计
            const mastered = words.filter(w => w.status === 'mastered').length;
            const learning = words.filter(w => w.status === 'learning').length;
            const unlearned = words.filter(w => w.status === 'new').length;

            // 计算总进度
            const progress = total > 0 ? Math.round((mastered / total) * 100) : 0;

            // 模拟最近7天的学习数据
            const recent7Days = [
                { date: '5/25', new: 15, review: 20 },
                { date: '5/26', new: 10, review: 25 },
                { date: '5/27', new: 12, review: 18 },
                { date: '5/28', new: 8, review: 30 },
                { date: '5/29', new: 5, review: 22 },
                { date: '5/30', new: 3, review: 28 },
                { date: '5/31', new: 2, review: 35 }
            ];

            // 模拟分组进度
            const groupProgress = {
                '第1组': 85,
                '第2组': 70,
                '第3组': 45
            };

            // 更新统计数据
            this.statsData = {
                totalProgress: progress,
                mastered,
                learning,
                unlearned,
                recent7Days,
                groupProgress,
                consecutiveDays: 7,
                totalLearned: mastered + learning
            };

            return this.statsData;
        } catch (error) {
            console.error('获取统计数据失败:', error);
            return this.statsData;
        }
    }

    // 渲染统计页面
    renderStatsPage() {
        const statsPage = document.getElementById('stats-page');
        if (!statsPage) return;

        // 更新总进度环形图
        const progressCircle = statsPage.querySelector('svg path[stroke="#3b82f6"]');
        if (progressCircle) {
            progressCircle.setAttribute('stroke-dasharray', `${this.statsData.totalProgress}, 100`);
        }

        const progressText = statsPage.querySelector('#stats-page .text-2xl');
        if (progressText) {
            progressText.textContent = `${this.statsData.totalProgress}%`;
        }

        // 更新统计数据
        const masteredElement = statsPage.querySelector('#stats-page .grid-cols-3').children[0].querySelector('.font-semibold');
        const learningElement = statsPage.querySelector('#stats-page .grid-cols-3').children[1].querySelector('.font-semibold');
        const unlearnedElement = statsPage.querySelector('#stats-page .grid-cols-3').children[2].querySelector('.font-semibold');

        if (masteredElement) masteredElement.textContent = this.statsData.mastered;
        if (learningElement) learningElement.textContent = this.statsData.learning;
        if (unlearnedElement) unlearnedElement.textContent = this.statsData.unlearned;

        // 更新最近7天学习曲线
        this.renderRecent7DaysChart();

        // 更新分组进度
        this.renderGroupProgress();

        // 更新学习记录
        const consecutiveDaysElement = statsPage.querySelector('#stats-page .grid-cols-2').children[0].querySelector('.text-3xl');
        const totalLearnedElement = statsPage.querySelector('#stats-page .grid-cols-2').children[1].querySelector('.text-3xl');

        if (consecutiveDaysElement) consecutiveDaysElement.textContent = this.statsData.consecutiveDays;
        if (totalLearnedElement) totalLearnedElement.textContent = this.statsData.totalLearned;
    }

    // 渲染最近7天学习曲线
    renderRecent7DaysChart() {
        const statsPage = document.getElementById('stats-page');
        if (!statsPage) return;

        const chartContainer = statsPage.querySelector('#stats-page svg');
        if (!chartContainer) return;

        // 清空现有内容（保留坐标轴）
        const polyline = chartContainer.querySelector('polyline');
        const circles = chartContainer.querySelectorAll('circle');

        if (polyline) {
            polyline.setAttribute('points', this.generateChartPoints());
        }

        if (circles) {
            circles.forEach((circle, index) => {
                const x = 40 + index * 40;
                const y = 100 - this.statsData.recent7Days[index].review * 2;
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
            });
        }
    }

    // 生成图表点
    generateChartPoints() {
        return this.statsData.recent7Days.map((day, index) => {
            const x = 40 + index * 40;
            const y = 100 - day.review * 2;
            return `${x},${y}`;
        }).join(' ');
    }

    // 渲染分组进度
    renderGroupProgress() {
        const statsPage = document.getElementById('stats-page');
        if (!statsPage) return;

        const progressContainers = statsPage.querySelectorAll('#stats-page .space-y-3 > div');
        progressContainers.forEach((container, index) => {
            const groupName = Object.keys(this.statsData.groupProgress)[index];
            const progress = this.statsData.groupProgress[groupName];

            const nameElement = container.querySelector('span:first-child');
            const percentageElement = container.querySelector('span:last-child');
            const progressBar = container.querySelector('.bg-blue-600');

            if (nameElement) nameElement.textContent = groupName;
            if (percentageElement) percentageElement.textContent = `${progress}%`;
            if (progressBar) progressBar.style.width = `${progress}%`;
        });
    }
}

// 导出实例
const statsManager = new StatsManager();
export default statsManager;