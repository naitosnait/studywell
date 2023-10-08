import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Page } from '../../models/page';
import { PageService } from '../../services/page.service';
import { switchMap } from 'rxjs/operators';
import { BaseComponent } from 'app/shared/base-component/base-component.component';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent extends BaseComponent {

  public page: Page;

  constructor(private route: ActivatedRoute, private pageService: PageService, public authService: AuthService, public router: Router) {
    super(authService, router);
    this.route.params
      .pipe(switchMap(params => this.pageService.getPageById(params['id'])))
      .subscribe(res => this.page = res);
  }

  public convertAge(ages: number[]) {
    if (!ages || ages?.length == 0) {
      return "None";
    }
    switch (ages?.length) {
      case 1:
        return ages[0];
      default:
        return `${ages[0]}-${ages[ages?.length - 1]}`;
    }
  }

  public editPage() {
    this.router.navigate(['/pages/edit', this.page.id]);
  }

  public deletePage() {
    this.pageService.deletePage(this.page).subscribe(() => this.router.navigate(['/pages/all']));
  }
}
