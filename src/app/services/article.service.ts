import { Article } from "app/models/article";
import { RestService } from "./rest.service";
import { isNullOrUndefined } from "app/utils/utils";

@Injectable()
export class ArticleService {
    constructor(private restService: RestService) { }

    public getArticles(page: number, size: number, userName: string, id: number) {
        var url = `/admin/articles/get?page=${page}&size=${size}`;
        if (isNullOrUndefined(userName))
            url += `&username=${userName}`;
        if (isNullOrUndefined(userName))
            url += `&id=${id}`;
        return this.restService.get<any>(url);
    }

    public createArticle(article: Article) {
        var url = "/admin/article/post";
        return this.restService.post<any>(url, article);
    }

    public editArticle(id: number, article: Article) {
        var url = `/admin/article/edit?article_id${id}`;
        return this.restService.put<any>(url, article);
    }

    public deleteArticle(id: number) {
        var url = `/admin/article/delete?article_id=${id}`;
        return this.restService.delete<string>(url);
    }
}