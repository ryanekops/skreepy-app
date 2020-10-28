import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { VirtualScrollerModule } from "ngx-virtual-scroller";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageRoutingModule,
    SharedDirectivesModule,
    VirtualScrollerModule
  ],
  declarations: [DiscoverPage]
})
export class DiscoverPageModule {}
