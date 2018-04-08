import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { BusinessUserPage } from '../pages/business-user/business-user';
import { NormalUserPage } from '../pages/normal-user/normal-user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              public userService: UserServiceProvider) {

    this.userService.checkAuthState().subscribe(auth => {
      if(!auth){
        console.log('Auth is false');
        this.rootPage = LoginPage;
      }
      else{
        console.log('Auth is true');
        this.userService.getCurrentUser().subscribe(x => {
          if(x['isBusiness'])
            this.rootPage = BusinessUserPage;
          else
            this.rootPage = NormalUserPage;
        })
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

