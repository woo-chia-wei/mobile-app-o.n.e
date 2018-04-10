import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CATEGORIES } from '../../shared/references';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { DealEvent } from '../../models/event';
import { GeoLocation } from '../../models/location';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';

@IonicPage()
@Component({
  selector: 'page-normal-user',
  templateUrl: 'normal-user.html',
})
export class NormalUserPage {

  private categories: string[] = CATEGORIES;
  private categoryFilter: string;
  private radiusFilter: number = 1;
  private dealEvents: DealEvent[];
  private mainDealEvents: any

  private current: GeoLocation;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider,
              public mapService: GoogleMapServiceProvider) {

    //For testing only, current location
    this.current = {
        lat: 1.317465,
        lng: 103.898082
    };

    this.categoryFilter = this.categories[0];
    this.eventService.getEventsForCustomer().subscribe(res => {
      this.mainDealEvents = res;
      this.updateList();
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NormalUserPage');
  }

  getStatus(dealEvent: DealEvent){
    let today = new Date().getTime();

    if(dealEvent.startTime <= today && today <= dealEvent.endTime){
      return 'Opening';
    }else if(today > dealEvent.endTime){
      return 'Closed';
    }else{
      return 'Soon';
    }
  }

  truncate(text: string){
    if(text.length > 30){
      return text.substring(0, 27) + '...';
    }

    return text;
  }

  isValidRange(lat1: number, lng1: number, lat2: number, lng2: number, radius: number): boolean{
    return this.mapService.getDistanceInKM(lat1, lng1, lat2, lng2) <= radius;
  }

  radiusChanged(){
    this.updateList();
  }

  categoryChanged(){
    this.updateList();
  }

  updateList(){
    this.dealEvents = [];
    this.mainDealEvents.forEach(e => {
      if(this.isValidRange(this.current.lat, this.current.lng, e['latitude'], e['longitude'], this.radiusFilter) &&
        this.categoryFilter == e['category']){
        this.dealEvents.push(e);
      }
    });
  }

  

}
