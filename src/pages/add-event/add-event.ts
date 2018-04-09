import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DealEvent } from '../../models/event';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { BusinessUserPage } from '../business-user/business-user';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddDealEventPage {

  private categories: string[] = ['Food and Beverage', 'Retailer'];
  private dealEvent: DealEvent = {} as DealEvent;
  private startTime: Date;
  private endTime: Date;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public toastController: ToastController,
              public eventService: EventServiceProvider) {
    this.dealEvent.category = this.categories[0];
    this.dealEvent.ownerId = this.userService.getCurrentUserId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEventPage');
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

  create() {

    if(this.endTime <= this.startTime){
      this.toastController.create({
        message: "End time cannot be earlier or equal than start time!",
        duration: 3000,
        position: 'top'
      }).present();

      return;
    }

    try{

      this.dealEvent.startTime = new Date(this.startTime).getTime();
      this.dealEvent.endTime = new Date(this.endTime).getTime();
      this.eventService.addEvent(this.dealEvent);

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
