import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor(private nativeHttp: HTTP) {}

  async viewStory(token, limit, offset){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.get(`${environment.url}/storiette/view/${limit}/${offset}`, {}, {});
    return ret;
    // return this.http.get(`${environment.url}/storiette/view/${limit}/${offset}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token, 
    //   })
    // });
  } 

  async viewRelated(token,id){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.get(`${environment.url}/storiette/related/${id}`, {}, {});
    return ret;
    // return this.http.get(`${environment.url}/storiette/related/${id}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }

  async detailStory(token, uniqueID){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.get(`${environment.url}/storiette/detail/${uniqueID}`, {}, {});
    return ret;
    // return this.http.get(`${environment.url}/storiette/detail/${uniqueID}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }

  async searchStory(token, value){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.get(`${environment.url}/storiette/search/${value}`, {}, {});
    return ret;
    // return this.http.get(`${environment.url}/storiette/search/${value}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }

  async seeStory(token,credential){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.post(`${environment.url}/storiette/see`, credential, {
      'Content-Type': 'application/json',
    });
    return ret;
    // return this.http.post(`${environment.url}/storiette/see`, credential, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }
}
