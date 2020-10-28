import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./public/discover/discover.module').then( m => m.DiscoverPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./public/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'book-detail/:id',
    loadChildren: () => import('./public/pages/book-detail/book-detail.module').then( m => m.BookDetailPageModule)
  },
  {
    path: 'book-read',
    loadChildren: () => import('./public/pages/book-read/book-read.module').then( m => m.BookReadPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: "reload" })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private platform: Platform,
    private storage: Storage,
    public navCtrl: NavController
  ) {
    this.platform.ready().then(() => {
      this.initApp();
    });
  }

  async initApp() {
    let USER = await this.storage.get("USER");
    if (USER) {
      this.navCtrl.navigateRoot("/tabs");
    } else {
      this.navCtrl.navigateRoot("/login");
    }
  }
}
