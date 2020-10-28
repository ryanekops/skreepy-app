import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { scaleAnimation } from 'src/app/animations';
import { BookmarkService } from 'src/app/services/bookmark/bookmark.service';
import { StoryService } from 'src/app/services/story/story.service';
import { environment } from 'src/environments/environment';
import { AdOptions } from "@capacitor-community/admob";
import { Plugins } from "@capacitor/core";
const { AdMob, Share } = Plugins;

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit {

  resultDetailStory: any = [];
  resultRelatedStory:  any = [];

  loadingPage: boolean;
  loadingBookmark: boolean = false;
  loadingRelated: boolean;

  slidesOptions = {
    slidesPerView: 2.5,
    spaceBetween: 0,
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20
  };

  persiapanIklan: boolean;

  admobReady: boolean = false;

  optionsInterstitial: AdOptions = {
    adId: environment.admobInterstitial,
    isTesting: environment.testAdmobInterstitial,
  };

  optionsVideo: AdOptions = {
    adId: environment.admobVideo,
    isTesting: environment.testAdmobVideo,
  };

  constructor(private activatedRoute: ActivatedRoute, private storyService: StoryService, private navCtrl: NavController, private storage: Storage, private bookmarkService: BookmarkService, private toastCtrl: ToastController, private loadingController: LoadingController) { }

  ngOnInit() {
    this.initDetailStory();

    //Menyiapkan Iklan
    this.persiapanIklan = true;

    setTimeout(() => {
      this.storage.get("ADMOB_TIME").then((val) => {
        if (val) {
          let date = new Date();
          let convertDate =
            date.getFullYear() +
            "/" +
            date.getMonth() +
            "/" +
            date.getDate() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds();
  
          let a = new Date(convertDate);
          let b = new Date(val);
          let sel = Math.floor(a.getTime() - b.getTime());
          if (Math.round(sel / 60000) >= 3) {
            this.persiapanIklanAdmob();
          } else {
            this.persiapanIklan = false;
          }
        } else {
          this.persiapanIklanAdmob();
        }
      });
      
    }, 500);
  }

  persiapanIklanAdmob(){
    this.storage.get("ADMOB_TYPE").then((val) => {
      if (val) {
        if(val == 'interstitial'){
          AdMob.prepareRewardVideoAd(this.optionsVideo).then(
            (value) => {
              this.persiapanIklan = false;
              console.log(value);
              this.admobReady = true;
            },
            (error) => {
              this.persiapanIklan = false;
              console.log(error);
              this.admobReady = false;
            }
          );

          AdMob.addListener("onRewardedVideoAdFailedToLoad", async (info: any) => {
            this.persiapanIklan = false;
              console.log(info);
              this.admobReady = false;
          });

          
        }else{
          AdMob.prepareInterstitial(this.optionsInterstitial).then(
            (value) => {
              this.persiapanIklan = false;
              console.log(value);
              this.admobReady = true;
            },
            (error) => {
              this.persiapanIklan = false;
              console.log(error);
              this.admobReady = false;
            }
          );

          AdMob.addListener("onAdFailedToLoad", async (info: any) => {
            this.persiapanIklan = false;
              console.log(info);
              this.admobReady = false;
          });
        }
      }else{
        AdMob.prepareInterstitial(this.optionsInterstitial).then(
          (value) => {
            this.persiapanIklan = false;
            console.log(value);
            this.admobReady = true;
          },
          (error) => {
            this.persiapanIklan = false;
            console.log(error);
            this.admobReady = false;
          }
        );
        AdMob.addListener("onAdFailedToLoad", async (info: any) => {
          this.persiapanIklan = false;
            console.log(info);
            this.admobReady = false;
        });
      }
    });
    
  }

  async initDetailStory(){
    this.loadingPage = true;
    setTimeout(async () => {
      const USER = await this.storage.get('USER');

    if(USER){

      let id = this.activatedRoute.snapshot.paramMap.get('id');

      this.storyService.detailStory(USER.token, id).then(async (e:any)=>{

        this.loadingPage = false;

        let res = JSON.parse(e.data);

        if(res.status == 200){
          this.resultDetailStory = res.data.payload;

          this.seeStory();

          if(this.resultDetailStory.length != 0){
            this.initRelatedStory(USER.token, id);
          }

        }else{
          const toast = await this.toastCtrl.create({
            message: res.data.message,
            mode: 'ios',
            color: 'dark',
            duration: 2000,
          }); 
          toast.present();
        }
      }).catch(async (err)=>{
        let error = JSON.parse(err.error);
        const toast = await this.toastCtrl.create({
          message: error.data.message,
          mode: 'ios',
          color: 'dark',
          duration: 2000,
        }); 
        toast.present();
      })
    }
    }, 350);
    
  }

  initRelatedStory(token, id){
    this.loadingRelated = true;
    setTimeout(() => {
      this.loadingRelated = false;
      this.storyService.viewRelated(token, id).then(async (e:any)=>{
        this.loadingRelated = false;
        let res = JSON.parse(e.data);
        if(res.status == 200){
          this.resultRelatedStory = res.data.payload;
        }else{
          const toast = await this.toastCtrl.create({
            message: res.data.message,
            mode: 'ios',
            color: 'dark',
            duration: 2000,
          }); 
          toast.present();
        }
      }).catch(async (err)=>{
        let error = JSON.parse(err.error);
        const toast = await this.toastCtrl.create({
          message: error.data.message,
          mode: 'ios',
          color: 'dark',
          duration: 2000,
        }); 
        toast.present();
      })
    }, 1000);
  }
  
  async seeStory(){
    const USER = await this.storage.get('USER');

    if(USER){

      let id = this.activatedRoute.snapshot.paramMap.get('id');

      this.storyService.seeStory(USER.token, {storyUid: id, sessionUid: USER.sessionID}).then(async (e:any)=>{
        let res = JSON.parse(e.data);
        if(res.status == 200){
          this.resultDetailStory.info.viewer = this.resultDetailStory.info.viewer + 1;
        }
      }).catch(async (err)=>{
        console.log(err);
      })

    }
  }

  routerRead(to, data){
    this.storage.get("ADMOB_TIME").then((val) => {
      if (val) {
        let date = new Date();
        let convertDate =
          date.getFullYear() +
          "/" +
          date.getMonth() +
          "/" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();

        let a = new Date(convertDate);
        let b = new Date(val);
        let sel = Math.floor(a.getTime() - b.getTime());
        if (Math.round(sel / 60000) >= 3) {
          this.routerWithAdmob(to,data);
        } else {
          this.routerWithoutAdmob(to,data);
        }
      } else {
        this.routerWithAdmob(to,data);
      }
    });
  }

  routerWithAdmob(to,result){

    if(this.admobReady){

      this.storage.get("ADMOB_TYPE").then((type) => {
        if(type){
          if(type == 'interstitial'){
            AdMob.showRewardVideoAd();

            AdMob.addListener("onRewardedVideoAdClosed", async (info: any) => {
              if (info.value == true) {
                const loading = await this.loadingController.create({
                  cssClass: "__my-loading",
                  message: "Tunggu sebentar...",
                  spinner: "circles",
                });
                await loading.present();

                setTimeout(async () => {
                  let date = new Date();
                  let convertDate =
                    date.getFullYear() +
                    "-" +
                    date.getMonth() +
                    "-" +
                    date.getDate() +
                    " " +
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds();
        
                  this.storage.set("ADMOB_TIME", convertDate);
                  this.storage.set("ADMOB_TYPE", 'video');
                  loading.dismiss();
                  const { role, data } = await loading.onDidDismiss();
                  this.navCtrl.navigateForward(to,{
                    animation: scaleAnimation,
                    state: {
                      data: result
                    }
                  });
                }, 1000);
              }
            });
          }else{
            AdMob.showInterstitial();

            AdMob.addListener("onAdClosed", async (info: any) => {
              console.log(info);
              if (info.value == true) {
                const loading = await this.loadingController.create({
                  cssClass: "__my-loading",
                  message: "Tunggu sebentar...",
                  spinner: "circles",
                });
                await loading.present();
 
                setTimeout(async () => {
                  let date = new Date();
                  let convertDate =
                    date.getFullYear() +
                    "-" +
                    date.getMonth() +
                    "-" +
                    date.getDate() +
                    " " +
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds();
        
                  this.storage.set("ADMOB_TIME", convertDate);
                  this.storage.set("ADMOB_TYPE", 'interstitial');
                  loading.dismiss();
                const { role, data } = await loading.onDidDismiss();
                  this.navCtrl.navigateForward(to,{
                    animation: scaleAnimation,
                    state: {
                      data: result
                    }
                  });
                }, 1000);
              }
            });
          }
        }else{
          AdMob.showInterstitial();

          AdMob.addListener("onAdClosed", async (info: any) => {
            if (info.value == true) {
              const loading = await this.loadingController.create({
                cssClass: "__my-loading",
                message: "Tunggu sebentar...",
                spinner: "circles",
              });
              await loading.present();

              setTimeout(async () => {
                let date = new Date();
                let convertDate =
                  date.getFullYear() +
                  "-" +
                  date.getMonth() +
                  "-" +
                  date.getDate() +
                  " " +
                  date.getHours() +
                  ":" +
                  date.getMinutes() +
                  ":" +
                  date.getSeconds();
      
                this.storage.set("ADMOB_TIME", convertDate);
                this.storage.set("ADMOB_TYPE", 'interstitial');
                loading.dismiss();
                const { role, data } = await loading.onDidDismiss();
                this.navCtrl.navigateForward(to,{
                  animation: scaleAnimation,
                  state: {
                    data: result
                  }
                });
              }, 1000);
            }
          });
        }
      });

      

    }else{
      this.navCtrl.navigateForward(to,{
        animation: scaleAnimation,
        state: {
          data: result
        }
      });
    }
  }

  routerWithoutAdmob(to,result){
    this.navCtrl.navigateForward(to,{
      animation: scaleAnimation,
      state: {
        data: result
      }
    });
  }

  async bookmark(data){

    if(!this.loadingBookmark){

      this.loadingBookmark = true;

      const USER = await this.storage.get('USER');

      if(USER){
          let convertDate: any = '';
          if(data.info.bookmark == null){
            let date = new Date();
            convertDate =
              date.getFullYear() +
              "-" +
              date.getMonth() +
              "-" +
              date.getDate() +
              " " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds();

              this.resultDetailStory.info.bookmark = convertDate;
          }else{
            convertDate = null;
            this.resultDetailStory.info.bookmark = null;
          }

          this.bookmarkService.bookmarkStory(USER.token, {storyUid: data.uniqueID, lastBook: convertDate}).then(async (e:any)=>{
            this.loadingBookmark = false;
            let res = JSON.parse(e.data);
            const toast = await this.toastCtrl.create({
              message: res.data.message,
              mode: 'ios',
              color: 'dark',
              duration: 2000,
            }); 
            toast.present();
          }).catch( async (err)=>{
            this.loadingBookmark = false;
            let error = JSON.parse(err.error);
            const toast = await this.toastCtrl.create({
              message: error.data.message,
              mode: 'ios',
              color: 'dark',
              duration: 2000,
            }); 
            toast.present();
          })
      }
    }

  }

  async share(data){
    let shareRet = await Share.share({
      title: data.title,
      text: data.content.substring(1, 100),
      url: 'https://play.google.com/store/apps/details?id=com.horror.house',
      dialogTitle: 'Bagikan ke teman'
    });
  }

}
