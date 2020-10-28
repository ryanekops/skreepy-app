import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  userData = {
    name: '...',
    photo: '',
    email: '...',
    bookmark: 0,
    reading: 0
  };

  constructor(private storage: Storage, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private navCtrl: NavController, private userService: UserService) { }

  async ngOnInit() {
    let USER = await this.storage.get('USER');
    if(USER){
      this.userData.name = USER.user.name;
      this.userData.photo = USER.user.photo;
      this.userData.email = USER.user.email;
      this.userData.bookmark = USER.info.bookmark;
      this.userData.reading = USER.info.reading; 
    }
  }

  async signOut(){
    const alert = await this.alertCtrl.create({
      cssClass: "__alert-custom",
      header: "Konfirmasi!",
      message: "Anda yakin ingin keluar dari aplikasi?",
      buttons: [
        {
          text: "Tidak",
          role: "cancel",
          cssClass: "cancel",
          handler: (blah) => {},
        },
        {
          text: "Ya, saya yakin",
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              cssClass: "__my-loading",
              message: "Tunggu sebentar...",
              spinner: "circles",
            });
            await loading.present();

            let USER = await this.storage.get('USER');

            this.userService.pauseUser(USER.token, {sessionID: USER.sessionID, logout: true}).then(async (e:any)=>{
              console.log(e);
            }).catch(async (err)=>{
              console.log(err);
            })

            setTimeout(() => {
              this.storage.remove('USER').then(async (_)=>{
                loading.dismiss();
                const { role, data } = await loading.onDidDismiss();
                const toast = await this.toastCtrl.create({
                  message: "Kamu berhasil keluar",
                  mode: 'ios',
                  color: 'dark',
                  duration: 2000,
                });
                toast.present();

                this.navCtrl.navigateRoot("/login");
              });
                
            }, 1000);
          },
        },
      ],
    });

    await alert.present();
  }

}
