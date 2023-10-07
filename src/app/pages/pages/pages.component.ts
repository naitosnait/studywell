import { CatalogService } from 'app/services/catalog.service';
import { PageInfo } from '../../models/page';
import { SearchService } from '../../services/search.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent {

  public searchTxt: string;
  public page = 1;
  public size = 10;
  public totalItems: number;

  public showPaging = false;

  public pages: Observable<PageInfo[]>

  constructor(private searchService: SearchService, private catalogService: CatalogService) {
    this.getPages(this.page);
  }

  public search() {
    if (typeof this.searchTxt == 'undefined' && !this.searchTxt || this.searchTxt?.length <= 2) {
      console.warn("Please enter 3 or more characters");
    } else {
      this.getPages(this.page);
    }
  }

  public getPages(page: number) {
    this.pages = this.catalogService.catalog(page, this.size, this.searchTxt).pipe(
      tap(res => {
        this.showPaging = true;
        var result = res[0];
        this.totalItems = result.total_items;
        // if(this.asyncIndex < 150){
        //   this.asyncIndex += 10; // increment index to show total changing
        // }
        this.page = page;
      }),
      map(res => res[0].items));
  }
}
