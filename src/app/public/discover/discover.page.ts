import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StoryService } from 'src/app/services/story/story.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  protected limit = 6;
  protected offset = 0;

  resultStory: Array<any> = [];

  loadingPage: boolean;

  constructor(private storyService: StoryService, private storage: Storage, private toastCtrl: ToastController, private userService: UserService) { }

  async ngOnInit() {
    this.initStory();

    const USER = await this.storage.get('USER');

    this.userService.resumeUser(USER.token, {sessionID: USER.sessionID}).then(async (e:any)=>{
      let res = JSON.parse(e.data);
      USER.sessionID = res.data.payload.sessionID;

      this.storage.set('USER', USER);
    }).catch(async (err)=>{
      console.log(err);
    });
    
  }

  async initStory(refresher?){
    if(!refresher){
      this.loadingPage = true;
    }

    const USER = await this.storage.get('USER');

    if(USER){
      this.storyService.viewStory(USER.token, this.limit, this.offset).then(async (e:any)=>{
        this.loadingPage = false;

        let res = JSON.parse(e.data);

        if(refresher){
          refresher.target.complete();
        }

        if(res.status == 200){
          this.resultStory = res.data.payload;
          this.offset = res.data.offset;
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
        console.log(err);
        this.loadingPage = false;
        let error = JSON.parse(err.error);

        if(refresher){
          refresher.target.complete(); 
        }

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
      this.initStory(event);
    }, 1000);
  }

  moreData(event){
    setTimeout(async () => {
      const USER = await this.storage.get('USER');

      if(USER){
        this.storyService.viewStory(USER.token, this.limit, this.offset).then(async (e:any)=>{
          event.target.complete();
          let res = JSON.parse(e.data);
          if(res.status == 200){
            this.resultStory = this.resultStory.concat(res.data.payload);
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
          let error = JSON.parse(err.error);
          event.target.complete();
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
