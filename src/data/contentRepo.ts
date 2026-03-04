import contentData from './content.json';

export interface Category {
    id: string;
    title: string;
    introText: string;
    audioUrl?: string;
}

export interface Topic {
    id: string;
    categoryId: string;
    title: string;
    body: string;
    audioUrl?: string;
    videoUrl?: string;
    icon?: string;
    narrator?: string;
}

interface ContentData {
    categories: Category[];
    topics: Topic[];
}

const data = contentData as ContentData;

const simulateDelay = (): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

export const contentRepo = {
    async getCategories(): Promise<Category[]> {
        await simulateDelay();
        return data.categories;
    },

    async getCategory(id: string): Promise<Category | undefined> {
        await simulateDelay();
        return data.categories.find((c) => c.id === id);
    },

    async getTopicsByCategory(categoryId: string): Promise<Topic[]> {
        await simulateDelay();
        return data.topics.filter((t) => t.categoryId === categoryId);
    },

    async getTopic(id: string): Promise<Topic | undefined> {
        await simulateDelay();
        return data.topics.find((t) => t.id === id);
    },
};
