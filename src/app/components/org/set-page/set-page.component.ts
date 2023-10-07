import { tap, switchMap, catchError, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, Subject, concat, of } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PageInfo } from 'app/models/page';
import { CatalogService } from 'app/services/catalog.service';
import { isNullOrUndefined } from 'app/utils/utils';
import { OrgService } from 'app/services/org.service';

@Component({
  selector: 'set-page',
  templateUrl: './set-page.component.html',
  styleUrls: ['./set-page.component.css']
})
export class SetPageComponent implements OnInit {

  @Input() email: string;

  public pages$: Observable<PageInfo[]>;
  public pagesLoading = false;
  public pageInput$ = new Subject<string>();
  public selectedPage: PageInfo;

  public disableSetButton: boolean = true;

  constructor(public activeModal: NgbActiveModal, private catalogService: CatalogService,
    private orgService: OrgService) { }

  ngOnInit() {
    console.log(this.email);
    this.loadPages();
  }

  public onChangeProgram(value: [PageInfo]) {
    this.disableSetButton = isNullOrUndefined(value);
  }

  public trackByFn(item: PageInfo) {
    return item.id;
  }

  public setPage() {
    this.orgService.setPageToOrg(+this.selectedPage.id, this.email, true)
      .subscribe(() => this.activeModal.close('Close click'));
  }

  private loadPages() {
    this.pages$ = concat(
      this.catalogService.catalog(1, 10).pipe(map(res => res[0].items)), // default items
      this.pageInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.pagesLoading = true),
        switchMap(term => this.catalogService.catalog(1, 10, term).pipe(
          catchError(() => of([])), // empty list on error
          map(res => res[0].items),
          tap(s => {
            this.pagesLoading = false;
          })
        ))
      )
    );
  }
}
