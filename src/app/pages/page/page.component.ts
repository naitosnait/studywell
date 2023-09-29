import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Page } from '../../models/page';
import { PageService } from '../../services/page.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {

  public page: Page;

  constructor(private route: ActivatedRoute, private router: Router, private pageService: PageService) {
    this.route.params
      .pipe(switchMap(params => this.pageService.getPageById(params['id'])))
      .subscribe(res => this.page = res);
  }

  public convertAge(ages: number[]) {
    if (!ages || ages?.length == 0) {
      return "None";
    }
    switch (ages.length) {
      case 1:
        return ages[0];
      default:
        return `${ages[0]}-${ages[ages.length - 1]}`;
    }
  }

  public editPage() {
    this.router.navigate(['/pages/edit', this.page.id]);
  }
}
