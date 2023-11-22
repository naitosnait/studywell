import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesComponent } from './articles.component';
import { CreateArtcleComponent } from './create-artcle/create-artcle.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from 'app/services/article.service';



@NgModule({
  declarations: [
    ArticlesComponent,
    CreateArtcleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NgSelectModule
  ],
  providers:[ArticleService],
  entryComponents:[CreateArtcleComponent]
})
export class ArticlesModule { }
