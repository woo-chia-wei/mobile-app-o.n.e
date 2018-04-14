import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { DealServiceProvider } from '../providers/deal-service/deal-service';
import { LoginPage } from '../pages/login/login';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { FIREBASE_CREDENTIALS } from './firebase.credentials';
import { ShareDealPage } from '../pages/share-deal/share-deal';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { BusinessUserPage } from '../pages/business-user/business-user';
import { NormalUserPage } from '../pages/normal-user/normal-user';
import { AddDealEventPage } from '../pages/add-event/add-event';
import { EventServiceProvider } from '../providers/event-service/event-service';
import { ProfilePage } from '../pages/profile/profile';
import { EditEventPage } from '../pages/edit-event/edit-event';
import { GoogleMapServiceProvider } from '../providers/google-map-service/google-map-service';
import { HttpClientModule } from '@angular/common/http';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

let config = FIREBASE_CREDENTIALS

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ShareDealPage,
    SignUpPage,
    BusinessUserPage,
    NormalUserPage,
    AddDealEventPage,
    ProfilePage,
    EditEventPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ShareDealPage,
    SignUpPage,
    BusinessUserPage,
    NormalUserPage,
    AddDealEventPage,
    ProfilePage,
    EditEventPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    DealServiceProvider,
    EventServiceProvider,
    GoogleMapServiceProvider,
    Geolocation,
    Device
  ]
})
export class AppModule {}
