import { Injectable } from '@angular/core';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { Plugins } from '@capacitor/core';
const { GoogleAuth } = Plugins;

export interface User {
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  emailVerified?: boolean,
  createdAt?: number,
  refreshToken?: string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afa: AngularFireAuth, private nativeHttp: HTTP) { }

  async loginGoogle(): Promise<User>{
    try {

      let googleUser = await GoogleAuth.signIn();

      const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);

      const { user } = await this.afa.signInAndRetrieveDataWithCredential(credential);

      const data: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        refreshToken: user.refreshToken
      }

      return data;

    } catch (err) {
      console.log('Error', err);
    }
    
  }

  async loginUser(credential){
    this.nativeHttp.setDataSerializer('json')
    const ret = await this.nativeHttp.post(`${environment.url}/auth/login`, credential, {
      'Content-Type': 'application/json',
    });
    return ret;
  }

  async pauseUser(token, credential){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.post(`${environment.url}/auth/logout`, credential, {
      'Content-Type': 'application/json',
    });
    return ret;
  }

  async resumeUser(token, credential){
    this.nativeHttp.setDataSerializer('json');
    this.nativeHttp.setHeader('*', 'Authorization', token);
    const ret = await this.nativeHttp.post(`${environment.url}/auth/resume`, credential, {
      'Content-Type': 'application/json',
    });
    return ret;
  }

}
