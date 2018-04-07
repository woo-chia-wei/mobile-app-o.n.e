import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ShareDealPage } from '../share-deal/share-deal';
import { FindDealPage } from '../find-deal/find-deal';

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
              public loadingController: LoadingController,
              public toastController: ToastController) {

    this.email = this.afAuth.auth.currentUser.email;

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

    let loader = this.loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    let toast = this.toastController.create({
      message: "Account is logout successfully.",
      duration: 1000,
      position: 'middle'
    });
    
    toast.present();

    this.afAuth.auth.signOut();
  }

}
