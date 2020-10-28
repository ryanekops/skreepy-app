import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService { 

  constructor(private http: HttpClient, private nativeHttp: HTTP) { 
 
  }

  async bookmarkStory(token, credential){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.post(`${environment.url}/bookmark/add`, credential, {
      'Content-Type': 'application/json',
    });
    return ret;
    // return this.http.post(`${environment.url}/bookmark/add`, credential, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }

  async viewBookmark(token, limit, offset){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.get(`${environment.url}/bookmark/view/${limit}/${offset}`, {}, {});
    return ret;
    // return this.http.get(`${environment.url}/bookmark/view/${limit}/${offset}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   })
    // });
  }

}
