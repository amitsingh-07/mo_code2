import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleCategoryComponent } from './article-category/article-category.component';
import { ArticleEntryComponent } from './article-entry/article-entry.component';
import { ArticleComponent } from './article.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '/', component: ArticleComponent},
  { path: '/category/:name', component: ArticleCategoryComponent},
  { path: '/entry/:id', component: ArticleEntryComponent},

  /* Legacy Routes */
  { path: '/learn-about-insurance', component: ArticleComponent},
  { path: '/learn-articles:id', component: ArticleCategoryComponent},
  { path: 'html:id', component: ArticleEntryComponent}
  // There is learn/learn-articles?category=All so use Activated Routes to get search params properly
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
