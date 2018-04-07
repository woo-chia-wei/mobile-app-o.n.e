import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AccountPage } from '../account/account';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public userService: UserServiceProvider) {
  }
 
  async login(user: User) {
    try {
      const result = await this.userService.loginUser(user.email, user.password);

      if (result) {

        this.loadingController.create({
          content: "Please wait...",
          duration: 3000
        });

        this.userService.logUserLogin();

        console.log("Login account successfully.");

        this.navCtrl.setRoot(AccountPage);
      }  
    }
    catch (e) {

      this.toastController.create({
        message: e,
        duration: 3000,
        position: 'top'
      }).present();

      user.password = "";

      console.error("login failure", e);
    }
  }
 
  async register(user: User) {
    try {
      const result = await this.userService.registerUser(user.email, user.password);
      if (result) {

        this.loadingController.create({
          content: "Please wait...",
          duration: 3000
        });

        this.toastController.create({
          message: "Account is created successfully.",
          duration: 1000,
          position: 'middle'
        }).present();

        console.log("Register account successfully.");

        this.navCtrl.setRoot(AccountPage);
      }
    } catch (e) {
      
      this.toastController.create({
        message: e,
        duration: 3000,
        position: 'top'
      }).present();

      user.password = "";

      console.error("Register failure", e);
    }
  }
}