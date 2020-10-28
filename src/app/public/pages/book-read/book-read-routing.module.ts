import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookReadPage } from './book-read.page';

const routes: Routes = [
  {
    path: '',
    component: BookReadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookReadPageRoutingModule {}
