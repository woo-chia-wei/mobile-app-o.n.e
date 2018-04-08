import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, DateTime } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
import { AccountPage } from '../account/account';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  private user: User = {} as User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public loadingController: LoadingController,
              public toastController: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  async register(user: User) {
    try {
      this.user.createdTime = new Date().toLocaleString();
      const result = await this.userService.registerUser(user);
      if (result) {

        this.loadingController.create({
          content: "Please wait...",
          duration: 3000
        });

        this.toastController.create({
          message: "Account is created successfully.",
          duration: 1000,
          position: 'top'
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
