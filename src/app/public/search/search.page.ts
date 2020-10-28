import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StoryService } from 'src/app/services/story/story.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild("autofocus", { static: false }) searchbar: IonSearchbar;

  search: string = '';

  loadingPage: boolean;
  not_found: boolean;

  dataSearch: any = [];

  constructor(private toastCtrl: ToastController, private storyService: StoryService, private storage: Storage) { }

  ngOnInit() {
    setTimeout(() => this.searchbar.setFocus(), 350);
  }

  searchStory(){
      this.loadingPage = true;
      this.not_found = false;
      this.dataSearch = [];
      setTimeout(async () => {
        let USER = await this.storage.get('USER');

        if(USER){ 
          this.storyService.searchStory(USER.token, this.search).then(async (e:any)=>{
            this.loadingPage = false;
            let res = JSON.parse(e.data);
            if(res.status == 200){

              this.dataSearch = res.data.payload;

              if(this.dataSearch.length == 0){
                this.not_found = true;;
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
          });
        }
      }, 1000);
  }

}
