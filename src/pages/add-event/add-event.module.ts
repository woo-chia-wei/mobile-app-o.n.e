import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDealEventPage } from './add-event';

@NgModule({
  declarations: [
    AddDealEventPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDealEventPage),
  ],
})
export class AddEventPageModule {}
