import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ShareDealPage } from '../share-deal/share-deal';
import { FindDealPage } from '../find-deal/find-deal';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  private email: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private afAuth: AngularFireAuth,
              public toastController: ToastController,
              public userService: UserServiceProvider,
              public db: AngularFireDatabase) {


    this.userService.getCurrentUser().subscribe(user => {
      this.email = user['email'];
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  shareDeals(){
    this.navCtrl.push(ShareDealPage);
  }

  findDeals(){
    this.navCtrl.push(FindDealPage);
  }

  logout(){

    let toast = this.toastController.create({
      message: "Logging out...",
      duration: 3000,
      position: 'top'
    });
    
    toast.onDidDismiss(() => {
      this.afAuth.auth.signOut();
    });
    toast.present();
  }

}
