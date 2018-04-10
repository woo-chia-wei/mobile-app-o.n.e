import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DealEvent } from '../../models/event';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { BusinessUserPage } from '../business-user/business-user';
import * as moment from 'moment';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';
import { CATEGORIES } from '../../shared/references';
import { GeoLocation } from '../../models/location';

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddDealEventPage {

  private categories: string[] = CATEGORIES;
  private dealEvent: DealEvent = {} as DealEvent;
  private startTime: Date;
  private endTime: Date;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public toastController: ToastController,
              public eventService: EventServiceProvider,
              public mapService: GoogleMapServiceProvider) {
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

    let errors: string[] = [];

    if(this.endTime <= this.startTime)
      errors.push("End time cannot be earlier or equal than start time!");

    let re = /\d{6}/;
    if(!re.test(this.dealEvent.postalCode))
      errors.push('Invalid postal code!');
    
    if(errors.length > 0){
      this.toastController.create({
        message: errors[0],
        duration: 3000,
        position: 'top'
      }).present();

      return;
    }

    this.mapService.callGeoCodingAPI(this.dealEvent.postalCode).subscribe(res => {

      try{
        
        let location = this.mapService.getLocation(res) as GeoLocation;
        this.dealEvent.latitude = location.lat;
        this.dealEvent.longitude = location.lng;
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
    })

   
    
  }

}
