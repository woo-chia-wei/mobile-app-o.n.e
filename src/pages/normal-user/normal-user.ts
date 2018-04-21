import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CATEGORIES } from '../../shared/references';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { DealEvent, DealEventView } from '../../models/event';
import { GeoPosition } from '../../models/location';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';
import { ProfilePage } from '../profile/profile';
import { Geolocation } from '@ionic-native/geolocation';
import { USE_GPS, CURRENT_LOCATION} from '../../environment/current.location';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import _ from "lodash";

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
  private dealEventViews: DealEventView[] = [];
  private dealEventViewsBackup: DealEventView[] = [];
  private mainDealEvents: any
  private obtainedFirstPosition: boolean = false;
  private freshScreen: boolean = true;

  private current: GeoPosition;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider,
              public mapService: GoogleMapServiceProvider,
              public geolocation: Geolocation,
              public userService: UserServiceProvider,
              public alertCtrl: AlertController) {

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
      if(this.freshScreen){
        this.updateList();
        this.loadMap();
        this.freshScreen = true;
        this.dealEventViewsBackup = [];
      }
    });
    
  }

  GetCurrentLocation(){
    console.log('Called GetCurrentLocation()');
    this.geolocation.getCurrentPosition({timeout:10000}).then(location => {
      console.log('Found location', location)
      this.current = {
        lat: location['coords']['latitude'],
        lng: location['coords']['longitude']
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

    let zoom = 14;
    switch(this.radiusFilter){
      case 1:
        zoom = 14;
        break;
      case 2:
      case 3:
        zoom = 13;
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        zoom = 12;
        break;
      case 8:
      case 9:
      case 10:
        zoom = 11;
        break;
    }

    let mapOptions = {
      center: new google.maps.LatLng(this.current.lat, this.current.lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addCenterMarker(this.current.lat, this.current.lng);

    let postalCodeCounts = _.countBy(this.dealEventViews, 'postalCode');

    for (let postalCode in postalCodeCounts) {  
      let dealEventView = _.find(this.dealEventViews, ['postalCode', postalCode])
      this.addEventMarker(dealEventView.latitude, dealEventView.longitude, postalCodeCounts[postalCode].toString(), postalCode);
    }

    var cityCircle = new google.maps.Circle({
      strokeColor: '#535399',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#a3d4ff',
      fillOpacity: 0.5,
      map: this.map,
      center: new google.maps.LatLng(this.current.lat, this.current.lng),
      radius: 1000 * this.radiusFilter
    });
 
  }

  addEventMarker(lat: number, lng: number, display: string, postalCode: string){
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${display}|FF776B|000000`,
      map: this.map,
      postalCode: postalCode
    });

    marker.addListener('click', () => {
      this.updateList2(marker['postalCode'])
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

  getStatus(dealEventView: DealEventView){
    let now = new Date().getTime();

    if(dealEventView.startTime <= now && now <= dealEventView.endTime){
      return 'Open';
    }else if(now > dealEventView.endTime){
      return 'Closed';
    }else{
      return 'Upcoming';
    }
  }

  isValidRange(lat1: number, lng1: number, lat2: number, lng2: number, radius: number): boolean{
    return this.mapService.getDistanceInKM(lat1, lng1, lat2, lng2) <= radius;
  }

  radiusChanged(){
    this.dealEventViewsBackup = [];
    this.updateList();
    this.loadMap();
  }

  categoryChanged(){
    this.dealEventViewsBackup = [];
    this.updateList();
    this.loadMap();
  }

  updateList(){

    if(!this.obtainedFirstPosition) return;

    this.dealEventViews = [];
    let today = new Date().getTime();

    this.mainDealEvents.forEach(e => {
      if(this.isValidRange(this.current.lat, this.current.lng, e['latitude'], e['longitude'], this.radiusFilter) &&
        this.categoryFilter == e['category'] &&
        !(today > e['endTime'])){
        
        let dealEventView: DealEventView = {
          id: e['id'],
          title:  e['title'],
          description:  e['description'],
          postalCode:  e['postalCode'],
          ownerId:  e['ownerId'],
          category: e['category'],
          startTime: e['startTime'],
          endTime: e['endTime'],
          url:  e['url'],
          address:  e['address'],
          longitude: e['longitude'],
          latitude:  e['latitude'],
          attending:  false,
          distance:  this.mapService.getDistanceInKM(this.current.lat, this.current.lng, e['latitude'], e['longitude'])
        }

        if(e['attendees'])
          dealEventView.attending = (this.userService.getCurrentUserId() in e['attendees'])

        this.dealEventViews.push(dealEventView);
      }
    });

    this.dealEventViews = this.dealEventViews.sort((e1, e2) => e1.distance - e2.distance).splice(0, 20);
  }

  updateList2(postalCode: string){
    if(this.dealEventViewsBackup.length == 0)
      this.dealEventViewsBackup = _.cloneDeep(this.dealEventViews);
    this.dealEventViews = this.dealEventViewsBackup.filter(d => d.postalCode == postalCode);
  }

  redirectToProfilePage(){
    this.navCtrl.push(ProfilePage);
  }

  showResultStatement(): string{
    if(this.dealEventViews.length == 0){
      return "No result is found."
    }else if(this.dealEventViews.length == 1){
      return "1 result is found."
    }else{
      return this.dealEventViews.length + " results are found."
    }
  }

  toggleAttendance(dealEventView: DealEventView){
    dealEventView.attending = !dealEventView.attending;

    let dealEvent = this.mainDealEvents.find(x => x['id'] == dealEventView.id);

    if(!dealEvent['attendees'])
      dealEvent['attendees'] = {}

    if(dealEventView.attending){
      dealEvent['attendees'][this.userService.getCurrentUserId()] = true;
    }else{  
      delete dealEvent['attendees'][this.userService.getCurrentUserId()]
    }

    this.freshScreen = false;
    this.eventService.updateEvent(dealEvent);

    let alert = this.alertCtrl.create({
      title: 'Notification',
      message: `Your appointment has been ${dealEventView.attending ? 'confirmed': 'cancelled'}.`,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  eventSelected(dealEventView: DealEventView){
    console.log('In eventSelected now...');
    
    let alert = this.alertCtrl.create({
      title: 'Event Details',
      message: `
      <br>
      <div align="left">
          <b>Title</b><br>
          ${dealEventView.title}
      </div>
      <br>
      <div align="left">
          <b>Description</b><br>
          ${dealEventView.description}
      </div>
      <br>
      <div align="left">
          <b>Address</b><br>
          ${dealEventView.address}
      </div>
  
      `,
      buttons: [
        {
          text: 'Back',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  cancelSecondFilter(){
    this.dealEventViews = _.cloneDeep(this.dealEventViewsBackup);
    this.dealEventViewsBackup = [];
  }

}
