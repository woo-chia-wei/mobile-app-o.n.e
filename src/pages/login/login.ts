import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { SignUpPage } from '../sign-up/sign-up';
import { MyApp } from '../../app/app.component';

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

        console.log("Login account successfully.");

        this.navCtrl.setRoot(MyApp);
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

  redirectToSignUp(){
    this.navCtrl.push(SignUpPage);
  }
 
  
}