import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindDealPage } from './find-deal';

@NgModule({
  declarations: [
    FindDealPage,
  ],
  imports: [
    IonicPageModule.forChild(FindDealPage),
  ],
})
export class FindDealPageModule {}
