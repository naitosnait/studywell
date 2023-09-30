import { Injectable } from "@angular/core";
import { RestService } from "app/services/rest.service";
import { Page, Price } from "../models/page";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { PageResponse } from "app/models/response";

@Injectable()
export class PageService {

  constructor(private restService: RestService) { }

  public getPageById(pageId: number): Observable<Page> {
    var url = `/page/${pageId}`;
    return this.restService.get<PageResponse>(url)
      .pipe(map(res => res.page));
  }

  public createPage(page: Page): Observable<number> {
    var url = "/admin/page/post";
    return this.restService.post<PageResponse>(url, page)
      .pipe(map(res => {
        console.info(res.page.id);
        return res.page.id;
      }));
  }

  public editPage(page: Page): Observable<number> {
    var url = `/admin/page/edit?id=${page.id}`;
    return this.restService.put<PageResponse>(url, page)
      .pipe(map(res => {
        console.info(res.page.id);
        return res.page.id;
      }));
  }

  public deletePage(page: Page): Observable<string> {
    var url = `/admin/page/delete?id=${page.id}`;
    return this.restService.delete<string>(url);
  }

  public calcPrice(original_price: number, original_currency: string, currency: number): Observable<Price> {
    var url = `/currency/calc?original_price=${original_price}&original_currency=${original_currency}&currency=${currency}`;
    return this.restService.get<Price>(url);
  }
}
