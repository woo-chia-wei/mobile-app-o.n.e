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


}
