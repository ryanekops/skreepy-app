import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fancyAnimation } from './animations';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/environment';
import { StoryService } from './services/story/story.service';
import { UserService } from './services/user/user.service';
import { BookmarkService } from './services/bookmark/bookmark.service';

import { HTTP } from '@ionic-native/http/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({
      navAnimation: fancyAnimation,
    }),
    IonicStorageModule.forRoot({
      name: '__HororDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
  ],
  providers: [
    StoryService,
    UserService,
    BookmarkService,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SETTINGS, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
