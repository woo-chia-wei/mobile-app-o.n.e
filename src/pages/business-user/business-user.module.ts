import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessUserPage } from './business-user';

@NgModule({
  declarations: [
    BusinessUserPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessUserPage),
  ],
})
export class BusinessUserPageModule {}
