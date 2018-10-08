import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleCategoryComponent } from './article-category/article-category.component';
import { ArticleEntryComponent } from './article-entry/article-entry.component';
import { ArticleComponent } from './article.component';

const routes: Routes = [
  { path: '', component: ArticleComponent},
  { path: 'category/:name', component: ArticleCategoryComponent},
  { path: 'entry/:id', component: ArticleEntryComponent},

  /* Legacy Routes */
  { path: 'learn-about-insurance', redirectTo: '', pathMatch: 'full'},
  { path: 'learn-articles?category=:name', redirectTo: 'category/:name', pathMatch: 'full'},
  { path: 'html', component: ArticleEntryComponent}
  // There is learn/learn-articles?category=All so use Activated Routes to get search params properly
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
