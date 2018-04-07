import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { AccountPage } from '../account/account';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
            public navCtrl: NavController, 
            public navParams: NavParams,
            public loadingController: LoadingController,
            public toastController: ToastController,
            public db: AngularFireDatabase) {
  }
 
  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {

        let loader = this.loadingController.create({
          content: "Please wait...",
          duration: 3000
        });

        this.db.list('logins').push({
          user: this.afAuth.auth.currentUser.email,
          loginTime: Date.now()
        });

        console.log("Login account successfully.");

        this.navCtrl.setRoot(AccountPage);
      }  
    }
    catch (e) {

      let toast = this.toastController.create({
        message: e,
        duration: 3000,
        position: 'top'
      });
      
      toast.present();
      user.password = "";

      console.error("login failure", e);
    }
  }
 
  async register(user: User) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {

        let loader = this.loadingController.create({
          content: "Please wait...",
          duration: 3000
        });

        let toast = this.toastController.create({
          message: "Account is created successfully.",
          duration: 1000,
          position: 'middle'
        });
        
        toast.present();

        console.log("Register account successfully.");

        this.afAuth.auth.currentUser

        this.navCtrl.setRoot(AccountPage);
      }
    } catch (e) {
      
      let toast = this.toastController.create({
        message: e,
        duration: 3000,
        position: 'top'
      });
      
      toast.present();
      user.password = "";

      console.error("Register failure", e);
    }
  }
}