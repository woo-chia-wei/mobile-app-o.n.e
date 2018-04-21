import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DealEvent } from '../../models/event';
import * as moment from 'moment';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { BusinessUserPage } from '../business-user/business-user';
import { CATEGORIES } from '../../shared/references';
import { MyApp } from '../../app/app.component';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';
import { GeoPosition } from '../../models/location';

declare var google;

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  @ViewChild('map') mapElement: ElementRef;
  private map: any;

  private categories: string[] = CATEGORIES;
  private dealEvent: DealEvent = {} as DealEvent;
  private startTime: any;
  private endTime: any;
  private confirmedMap: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider,
              public toastController: ToastController,
              public mapService: GoogleMapServiceProvider) {
    this.dealEvent = navParams.get('data');
    this.startTime = new Date(this.dealEvent.startTime + 8 * 60 * 60 * 1000).toISOString();
    this.endTime = new Date(this.dealEvent.endTime + 8 * 60 * 60 * 1000).toISOString();
    this.loadMap();
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
      this.dealEvent.startTime = new Date(this.startTime).getTime() - 8 * 60 * 60 * 1000;
      this.dealEvent.endTime = new Date(this.endTime).getTime() - 8 * 60 * 60 * 1000;
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

  redirectToApp(){
    this.navCtrl.push(MyApp);
  }
  
  isValidPostalCode(): boolean{
    return /^\d{6}$/.test(this.dealEvent.postalCode);
  }

  postalCodeChanged(){
    this.confirmedMap = false;

    if(this.isValidPostalCode()){
      this.loadMap();
    }
  }

  loadMap(){
    this.map = null;

    this.mapService.callGeoCodingAPI(this.dealEvent.postalCode).subscribe(res => {

      let location = this.mapService.getLocation(res) as GeoPosition;

      console.log('Found location', location);

      let mapOptions = {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map
      });

      this.confirmedMap = true;

    },
    error => {
      console.error(error);
      this.map = null;
      this.confirmedMap = false;
    });
  }

}
