import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AddDealEventPage } from '../add-event/add-event';

@IonicPage()
@Component({
  selector: 'page-business-user',
  templateUrl: 'business-user.html',
})
export class BusinessUserPage {

  private user: User = {} as User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserServiceProvider) {
    this.userService.getCurrentUser().subscribe(u => this.user = u as User);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessUserPage');
  }

  redirectToAddEventPage(){
    this.navCtrl.push(AddDealEventPage);
  }

}
