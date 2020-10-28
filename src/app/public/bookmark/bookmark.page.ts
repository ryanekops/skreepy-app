import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BookmarkService } from 'src/app/services/bookmark/bookmark.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  protected limit = 15;
  protected offset = 0;

  resultBookmark: Array<any> = [];

  loadingPage: boolean;

  constructor(private bookmarkService: BookmarkService, private storage: Storage, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.initBookmark();
  }

  async initBookmark(refresher?){
    if(!refresher){
      this.loadingPage = true;
    }

    const USER = await this.storage.get('USER');

    if(USER){
      this.bookmarkService.viewBookmark(USER.token, this.limit, this.offset).then(async (e:any)=>{
        this.loadingPage = false;
        let res = JSON.parse(e.data);
        if(refresher){
          refresher.target.complete();
        }
        if(res.status == 200){
          this.resultBookmark = res.data.payload;
          this.offset = res.data.offset;

          if(res.data.payload.length < this.limit){
            this.infiniteScroll.disabled = true;
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
        if(refresher){
          refresher.target.complete();
        }
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

  doRefresh(event){
    this.offset = 0;
    this.infiniteScroll.disabled = false;
    setTimeout(() => {
      this.initBookmark(event);
    }, 1000);
  }

  moreData(event){
    setTimeout(async () => {
      const USER = await this.storage.get('USER');

      if(USER){
        this.bookmarkService.viewBookmark(USER.token, this.limit, this.offset).then(async (e:any)=>{
          event.target.complete();
          let res = JSON.parse(e.data);
          if(res.status == 200){
            this.resultBookmark = this.resultBookmark.concat(res.data.payload);
            if (res.data.offset == null) {
              event.target.disabled = true;
              this.infiniteScroll.disabled = true;
            }
            this.offset = res.data.offset;
          }else{
            const toast = await this.toastCtrl.create({
              message: res.message,
              mode: 'ios',
              color: 'dark',
              duration: 2000,
            }); 
            toast.present();
          }
        }).catch(async (err)=>{
          event.target.complete();
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
      
    }, 500);
  }

}
