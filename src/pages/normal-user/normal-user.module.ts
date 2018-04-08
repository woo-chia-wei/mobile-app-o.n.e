import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NormalUserPage } from './normal-user';

@NgModule({
  declarations: [
    NormalUserPage,
  ],
  imports: [
    IonicPageModule.forChild(NormalUserPage),
  ],
})
export class NormalUserPageModule {}
