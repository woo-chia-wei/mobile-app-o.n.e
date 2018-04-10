import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GOOGLE_MAP_API_KEY } from '../../app/google.map.credentials';

/*
  Generated class for the GoogleMapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GoogleMapServiceProvider Provider');
  }

  public callGeoCodingAPI(postalCode: string){
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Singapore ${postalCode}&key=${GOOGLE_MAP_API_KEY}`);
  }

  //Example: {lat: 1.317465, lng: 103.898082}
  public getLocation(response: any){
    return response['results'][0]['geometry']['location'];
  }

  //Source of formula:
  //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#27943
  public getDistanceInKM(lat1: number, lng1: number, lat2: number, lng2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);
    var dLon = this.deg2rad(lng2-lng1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }

  


}
