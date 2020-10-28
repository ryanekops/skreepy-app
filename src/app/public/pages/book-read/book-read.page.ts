import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Plugins, HapticsNotificationOptions, HapticsNotificationType } from "@capacitor/core";
const { Haptics } = Plugins;

@Component({
  selector: 'app-book-read',
  templateUrl: './book-read.page.html',
  styleUrls: ['./book-read.page.scss'],
})
export class BookReadPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  storyRead: any = [];

  scrollTop: number = 0;

  jumpScare: boolean = false;
  timeount: any;
  timeountend: any;

  constructor(private router: Router, private storage:Storage, private alertCtrl: AlertController, private navCtrl: NavController, private toastCtrl: ToastController) { }

  ionViewDidLeave(){
    clearTimeout(this.timeount);
    clearTimeout(this.timeountend);
  }

  async ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.storyRead = this.router.getCurrentNavigation().extras.state.data;
    }
    console.log(this.storyRead);
    if(this.storyRead.jumpScare.sec != 0){
      this.timeount = setTimeout(() => {
        this.jumpScare = true;
        Haptics.notification({
          type: HapticsNotificationType.ERROR
        });
        Haptics.vibrate();
        
      }, this.storyRead.jumpScare.sec);

      this.timeountend = setTimeout(() => {
        this.jumpScare = false;
        clearTimeout(this.timeount);
        clearTimeout(this.timeountend); 
      }, parseInt(this.storyRead.jumpScare.sec) + 6000);
    }

    let LASTREAD = await this.storage.get('READER_'+this.storyRead.uniqueID);

    if(LASTREAD){
      this.content.scrollToPoint(0, LASTREAD.scrollTop, 400);
      this.storage.remove('READER_'+this.storyRead.uniqueID);
      const toast = await this.toastCtrl.create({
        message: "Silahkan melanjutkan membaca...",
        mode: 'ios',
        color: 'dark',
        duration: 2000,
      }); 
      toast.present();
    }
  }

  async pin(){
      const alert = await this.alertCtrl.create({
        cssClass: "__alert-custom",
        header: "Konfirmasi!",
        message: "Apakah kamu ingin melanjutkannya nanti?",
        buttons: [
          {
            text: "Tidak",
            role: "cancel",
            cssClass: "cancel",
            handler: (blah) => {
              this.storage.remove('READER_'+this.storyRead.uniqueID);
            },
          },
          {
            text: "Lanjutkan nanti",
            handler: async () => {
              this.storage.set('READER_'+this.storyRead.uniqueID,{scrollTop: this.scrollTop});
              this.navCtrl.pop();
            },
          },
        ],
      });
  
      await alert.present();
  }

  async logScrollEnd(event){
    
  }

  onScroll(event){
    this.scrollTop = event.detail.scrollTop;
  }

}
