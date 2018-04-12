import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CATEGORIES } from '../../shared/references';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { DealEvent } from '../../models/event';
import { GeoLocation } from '../../models/location';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';
import { ProfilePage } from '../profile/profile';

declare var google;

@IonicPage()
@Component({
  selector: 'page-normal-user',
  templateUrl: 'normal-user.html',
})
export class NormalUserPage {

  @ViewChild('map') mapElement: ElementRef;
  private map: any;

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
      this.loadMap();
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NormalUserPage');
  }

  loadMap(){
    
    this.map = null;

    let mapOptions = {
      center: new google.maps.LatLng(this.current.lat, this.current.lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker(this.current.lat, this.current.lng);
    this.dealEvents.forEach(dealEvent => {
      this.addMarker(dealEvent.latitude, dealEvent.longitude);
    });
 
  }

  addMarker(lat: number, lng: number){
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
    });
    
    marker.setMap(this.map);
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
    if(text.length > 25){
      return text.substring(0, 22) + '...';
    }

    return text;
  }

  isValidRange(lat1: number, lng1: number, lat2: number, lng2: number, radius: number): boolean{
    return this.mapService.getDistanceInKM(lat1, lng1, lat2, lng2) <= radius;
  }

  radiusChanged(){
    this.updateList();
    this.loadMap();
  }

  categoryChanged(){
    this.updateList();
    this.loadMap();
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

  redirectToProfilePage(){
    this.navCtrl.push(ProfilePage);
  }

}
