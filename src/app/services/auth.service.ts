import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private myRoute: Router
  ) 
  { }

  isLoggednIn() {
    return localStorage.getItem('user') !== null;
  }

  login(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    this.myRoute.navigate(['home']);
    var ref = this.db.object(`users`);
    var key = userData.nickname;
    ref.update({ [key]: userData });
    return;
  }

  async loginWithGoogle(nickname: string) {
    try {
      const res = await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      localStorage.setItem('user', JSON.stringify(res.additionalUserInfo));
      localStorage.setItem('nickname', nickname);
      console.log(res);
      this.myRoute.navigate(['home']);
      return;
    }
    catch (err) {
      console.log(err);
      this.myRoute.navigate(['login']);
      return;
    }
  }
  
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('nickname');
    console.log('Logged Out!');
    this.myRoute.navigate(['login']);
    return this.afAuth.auth.signOut();
  }
}