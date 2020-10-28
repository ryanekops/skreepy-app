import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'discover',
        loadChildren: () => import('../public/discover/discover.module').then(m => m.DiscoverPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../public/search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'bookmark',
        loadChildren: () => import('../public/bookmark/bookmark.module').then(m => m.BookmarkPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../public/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/discover',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
