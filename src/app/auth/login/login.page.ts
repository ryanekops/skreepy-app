import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user/user.service';
import { Plugins } from '@capacitor/core';
const { Device, FCMPlugin } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private formLogin = {
    uid: '',
    email: '',
    name: '',
    photo: '',
    verified: false,
    fcm: '',
    token: '',
    device_os: '',
    device_name: '',
    device_uuid: ''
  };

  constructor(private userService: UserService, private storage: Storage, private navCtrl: NavController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  async ngOnInit() {
    
    const info = await Device.getInfo();
    this.formLogin.fcm = (await FCMPlugin.getToken()).token;
    this.formLogin.device_os = info.operatingSystem+'-'+info.osVersion;
    this.formLogin.device_name = info.model;
    this.formLogin.device_uuid = info.uuid;
    
  }
 
  async loginGoogle(){

    const loading = await this.loadingCtrl.create({
      cssClass: "__my-loading",
      message: "Loading...",
      spinner: "circles",
    });
    await loading.present();

    let user = await this.userService.loginGoogle();

    if(user){ 

      console.log(user);

      this.formLogin.uid = user.uid;
      this.formLogin.name = user.displayName;
      this.formLogin.photo = user.photoURL;
      this.formLogin.email = user.email;
      this.formLogin.verified = true;
      this.formLogin.token = user.refreshToken;

      this.userService.loginUser(this.formLogin).then(async (e:any)=>{
        let res = JSON.parse(e.data);
        if(res.status == 200){
          let userLogin = await this.storage.set('USER', res.data.payload);

          if(userLogin){
            loading.dismiss();
            const { role, data } = await loading.onDidDismiss();

            this.navCtrl.navigateRoot("/tabs");

            const toast = await this.toastCtrl.create({
              message: res.data.message,
              mode: 'ios',
              color: 'dark',
              duration: 2000,
            }); 
            toast.present();
             
          }
        }
      }).catch(async (err)=>{
        console.log(err);
        let error = JSON.parse(err.error);
        loading.dismiss();
        const { role, data } = await loading.onDidDismiss();
        const toast = await this.toastCtrl.create({
          message: error.data.message,
          mode: 'ios',
          color: 'dark',
          duration: 2000,
        }); 
        toast.present();
      });
    }else{
      loading.dismiss();
      const { role, data } = await loading.onDidDismiss();
      const toast = await this.toastCtrl.create({
        message: "Login Error",
        mode: 'ios',
        color: 'dark',
        duration: 2000,
      }); 
      toast.present();
    }
  }

}
