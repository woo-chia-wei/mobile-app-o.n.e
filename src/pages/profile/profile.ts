import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private user: User = {} as User;
  private accountType: string;
  private createdTime: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserServiceProvider) {

    this.userService.getCurrentUser().subscribe(u => {
      this.user = u as User;
      this.accountType = this.user.isBusiness ? 'Business' : 'Consumer';
      this.createdTime = moment(new Date(this.user.createdTime)).format('YYYY-MMM-DD HH:mm:ss');
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  redirectToApp(){
    this.navCtrl.push(MyApp);
  }

  logout(){
    this.userService.logOut();
    this.navCtrl.push(MyApp);
  }

}
