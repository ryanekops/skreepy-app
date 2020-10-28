import { Component, QueryList, ViewChildren } from '@angular/core';

import { ActionSheetController, AlertController, IonRouterOutlet, ModalController, Platform, ToastController } from '@ionic/angular';

//API
import { Plugins, StatusBarStyle, KeyboardInfo } from "@capacitor/core";
import { Router } from "@angular/router";
import { Storage } from '@ionic/storage';
import { UserService } from './services/user/user.service';

const { StatusBar, Keyboard, AdMob, SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      SplashScreen.hide({
        fadeOutDuration: 500
      });

      this.platform.backButton.subscribeWithPriority(1, async () => {
        const elementModal = await this.modalCtrl.getTop();
        if (elementModal) {
          elementModal.dismiss();
          return;
        }

        const elementAlert = await this.alertCtrl.getTop();
        if (elementAlert) {
          elementAlert.dismiss();
          return;
        }

        const elementAction = await this.actionSheetCtrl.getTop();
        if (elementAction) {
          elementAction.dismiss();
          return;
        }

        this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
          if (outlet && outlet.canGoBack()) {
            outlet.pop();
          } else if (
            this.router.url === "/login" ||
            this.router.url === "/tabs/discover" ||
            this.router.url === "/tabs/bookmark" ||
            this.router.url === "/tabs/account"
          ) {
            if (
              new Date().getTime() - this.lastTimeBackPress <
              this.timePeriodToExit
            ) {
              this.initLog('pause');
              navigator["app"].exitApp();
            } else {
              const toast = await this.toastCtrl.create({
                message: "Press back again to exit App.",
                mode: 'ios',
                color: 'dark',
                duration: 2000,
              });
              toast.present();

              this.lastTimeBackPress = new Date().getTime();
            }
          }
        });
      });

      AdMob.initialize();

      this.platform.pause.subscribe(async () => {
        this.initLog('pause');
      });

      this.platform.resume.subscribe(async () => {
        this.initLog('resume');
      });

      Keyboard.addListener("keyboardDidShow", (info: KeyboardInfo) => {
        document.querySelector("ion-app").style.transitionDuration = "300ms";
        document.querySelector("ion-app").style.bottom =
          info.keyboardHeight + "px";
      });

      Keyboard.addListener("keyboardDidHide", () => {
        document.querySelector("ion-app").removeAttribute("style");
      });

      StatusBar.setStyle({
        style: StatusBarStyle.Dark,
      });
      StatusBar.setBackgroundColor({
        color: "#11000000",
      });
      StatusBar.setOverlaysWebView({
        overlay: true,
      });
    });
  }

  async initLog(event){

    const USER = await this.storage.get('USER');

    if(USER){
      if(event == 'pause'){
        this.userService.pauseUser(USER.token, {sessionID: USER.sessionID, logout: false}).then(async (e:any)=>{
          console.log(e);
        }).catch(async (err)=>{
          console.log(err);
        })
      }else if(event == 'resume'){
        this.userService.resumeUser(USER.token, {sessionID: USER.sessionID}).then(async (e:any)=>{
          let res = JSON.parse(e.data);
          USER.sessionID = res.data.payload.sessionID;

          this.storage.set('USER', USER);
        }).catch(async (err)=>{
          console.log(err);
        }) 
      }
    }
  }
}
