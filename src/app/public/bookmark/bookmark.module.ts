import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookmarkPageRoutingModule } from './bookmark-routing.module';

import { BookmarkPage } from './bookmark.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { VirtualScrollerModule } from "ngx-virtual-scroller";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookmarkPageRoutingModule,
    SharedDirectivesModule,
    VirtualScrollerModule
  ],
  declarations: [BookmarkPage]
})
export class BookmarkPageModule {}
