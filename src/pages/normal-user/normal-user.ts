import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CATEGORIES } from '../../shared/references';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { DealEvent } from '../../models/event';
import { GeoPosition } from '../../models/location';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';
import { ProfilePage } from '../profile/profile';
import { Geolocation } from '@ionic-native/geolocation';
import { USE_GPS, CURRENT_LOCATION} from '../../environment/current.location';

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
  private dealEvents: DealEvent[] = [];
  private mainDealEvents: any
  private obtainedFirstPosition: boolean = false;

  private current: GeoPosition;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider,
              public mapService: GoogleMapServiceProvider,
              public geolocation: Geolocation) {

    if(USE_GPS){
      this.GetCurrentLocation();
    }else{
      this.current = {
        lat: CURRENT_LOCATION.lat,
        lng: CURRENT_LOCATION.lng
      }
      this.obtainedFirstPosition = true;
    }

    this.categoryFilter = this.categories[0];
    this.eventService.getEventsForCustomer().subscribe(res => {
      this.mainDealEvents = res;
      this.updateList();
      this.loadMap();
    });
    
  }

  GetCurrentLocation(){
    console.log('Called GetCurrentLocation()');
    this.geolocation.getCurrentPosition({timeout:10000}).then(location => {
      console.log('Found location', location)
      this.current = {
        lat: location['coord']['latitude'],
        lng: location['coord']['longitude']
      }
      this.obtainedFirstPosition = true;
    }).catch(error => {
      console.error('Failure on getting current location', error);
      this.GetCurrentLocation();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NormalUserPage');
  }

  loadMap(){

    if(!this.obtainedFirstPosition) return;

    this.map = null;

    let mapOptions = {
      center: new google.maps.LatLng(this.current.lat, this.current.lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addCenterMarker(this.current.lat, this.current.lng);

    this.dealEvents.forEach((dealEvent, index) => {
      this.addEventMarker(dealEvent.latitude, dealEvent.longitude, (index + 1).toString());
    });
 
  }

  addEventMarker(lat: number, lng: number, display: string){
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${display}|FF776B|000000`,
      map: this.map
    });
  }
  
  addCenterMarker(lat: number, lng: number){
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: {
        url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
        scaledSize: new google.maps.Size(30, 30),
      },
      map: this.map
    });
  }

  getStatus(dealEvent: DealEvent){
    let today = new Date().getTime();

    if(dealEvent.startTime <= today && today <= dealEvent.endTime){
      return 'Open';
    }else if(today > dealEvent.endTime){
      return 'Closed';
    }else{
      return 'Upcoming';
    }
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

    if(!this.obtainedFirstPosition) return;

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

  showResultStatement(): string{
    if(this.dealEvents.length == 0){
      return "No result is found."
    }else if(this.dealEvents.length == 1){
      return "1 result is found."
    }else{
      return this.dealEvents.length + " results is found."
    }
  }

}
