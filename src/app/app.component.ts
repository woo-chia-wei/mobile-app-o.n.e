import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { AccountPage } from '../pages/account/account';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(auth => {
      if(!auth){
        console.log('Auth is false');
        this.rootPage = LoginPage;
      }
      else{
        console.log('Auth is true');
        this.rootPage = AccountPage;
      }
        
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

