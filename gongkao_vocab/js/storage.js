// IndexedDB 存储封装
class VocabularyStorage {
    constructor() {
        this.dbName = 'VocabularyDB';
        this.storeName = 'words';
        this.db = null;
    }

    // 初始化数据库
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event) => {
                console.error('数据库打开失败:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'wordId' });
                    store.createIndex('word', 'word', { unique: true });
                    store.createIndex('status', 'status');
                    store.createIndex('nextReview', 'nextReview');
                }
            };
        });
    }

    // 获取所有词语
    async getAllWords() {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // 保存词语
    async saveWord(word) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(word);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // 批量保存词语
    async saveWords(words) {
        await this.initDB();
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        words.forEach(word => {
            store.put(word);
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // 获取今日需要复习的词语
    async getTodayReviews() {
        await this.initDB();
        const today = new Date().toISOString().split('T')[0];

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('nextReview');
            const request = index.openCursor(IDBKeyRange.upperBound(today));

            const reviews = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const word = cursor.value;
                    if (word.status !== 'mastered') {
                        reviews.push(word);
                    }
                    cursor.continue();
                } else {
                    resolve(reviews);
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    // 初始化词库（首次使用时）
    async initializeVocabulary(words) {
        await this.initDB();
        const existingWords = await this.getAllWords();

        if (existingWords.length === 0) {
            // 为每个词语添加学习进度数据
            const wordsWithProgress = words.map((word, index) => ({
                ...word,
                wordId: index + 1,
                status: 'new',
                interval: 0,
                easeFactor: 2.5,
                nextReview: new Date().toISOString().split('T')[0],
                reviewCount: 0,
                lastReview: ''
            }));

            await this.saveWords(wordsWithProgress);
            console.log('词库初始化完成');
        }
    }
}

// 导出实例
const vocabularyStorage = new VocabularyStorage();
export default vocabularyStorage;