import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {

  constructor(private afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
    console.log('Hello UserServiceProvider Provider');
  }

  public loginUser(email: string, password: string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public registerUser(newUser: User){
    
    

    return this.afAuth.auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then((u) => {
      console.log('object', `users/${u.uid}`);
      console.log('user', newUser);
      this.db.object(`users/${u.uid}`).set(newUser);
    });
  }

  public getCurrentUserEmail(): string{
    return this.afAuth.auth.currentUser.email;
  }

  public getCurrentUserId(): string{
    return this.afAuth.auth.currentUser.uid;
  }

  public logUserLogin(){
    this.db.list('logins').push({
      user: this.afAuth.auth.currentUser.email,
      loginTime: Date.now()
    });
  }

  public GetCurrentUser(){
    return this.db.object(`users/${this.getCurrentUserId()}`).valueChanges();
  }
}
