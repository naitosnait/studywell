export interface Article {
    username: string;
    title: string;
    content: string;
    photo: string;
    video: string;
}

export interface ExistArticle extends Article {
    article_id: number;
    created_at: Date;
    updated_at: Date;
}
