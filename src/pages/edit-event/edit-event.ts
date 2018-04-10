import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DealEvent } from '../../models/event';
import * as moment from 'moment';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { BusinessUserPage } from '../business-user/business-user';
import { CATEGORIES } from '../../shared/references';

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  private categories: string[] = CATEGORIES;
  private dealEvent: DealEvent = {} as DealEvent;
  private startTime: any;
  private endTime: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider,
              public toastController: ToastController) {
    this.dealEvent = navParams.get('data');
    this.startTime = new Date(this.dealEvent.startTime).toISOString();
    this.endTime = new Date(this.dealEvent.endTime).toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage');
  }

  private getMinDate(): string{
    return moment().format('YYYY-MM-DD')
  }

  private getMaxDate(): string{
    return moment().add(1, 'years').format('YYYY-MM-DD')
  }

  validate() {

    return (this.dealEvent.category) &&
           (this.dealEvent.title) &&
           (this.dealEvent.description) &&
           (this.startTime != null) &&
           (this.endTime != null) &&
           (this.dealEvent.postalCode);
  }

  saveEvent(){
    try{
      this.dealEvent.startTime = new Date(this.startTime).getTime();
      this.dealEvent.endTime = new Date(this.endTime).getTime();
      this.eventService.updateEvent(this.dealEvent);

      this.toastController.create({
        message: "Event added successfully!",
        duration: 3000,
        position: 'top'
      }).present();

      this.navCtrl.push(BusinessUserPage);

    }catch(error){
      this.toastController.create({
        message: error,
        duration: 3000,
        position: 'top'
      }).present();
    }
  }

}
