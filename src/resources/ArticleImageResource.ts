import type { ArticleImage } from "@prisma/client";

export default class ArticleImageResource {
    collection(articles: ArticleImage[]): object[] {
        return articles.map((article) => {
            return this.transform(article);
        });
    }

    get(article: ArticleImage): object {
        return this.transform(article);
    }

    transform(article: ArticleImage): object {
        const constructUrl = () => {
            if (process.env.NODE_ENV == 'development') {
                return process.env.APP_URL + ':' + process.env.APP_PORT + "/storage/" + article.path
            }
            return process.env.APP_URL + "/storage/" + article.path

        }
        return {
            id: article.id,
            article_id: article.articleId,
            url:constructUrl() ,
        };
    }
}
