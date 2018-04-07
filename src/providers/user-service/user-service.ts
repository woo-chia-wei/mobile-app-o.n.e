import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class UserServiceProvider {

  constructor(private afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
    console.log('Hello UserServiceProvider Provider');
  }

  public loginUser(email: string, password: string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public registerUser(email: string, password: string){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public getCurrentUserEmail(): string{
    return this.afAuth.auth.currentUser.email;
  }

  public logUserLogin(){
    this.db.list('logins').push({
      user: this.afAuth.auth.currentUser.email,
      loginTime: Date.now()
    });
  }
}
