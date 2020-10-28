import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookReadPageRoutingModule } from './book-read-routing.module';

import { BookReadPage } from './book-read.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookReadPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [BookReadPage]
})
export class BookReadPageModule {}
