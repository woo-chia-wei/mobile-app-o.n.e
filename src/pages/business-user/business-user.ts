import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AddDealEventPage } from '../add-event/add-event';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { Observable } from '@firebase/util';
import { DealEvent } from '../../models/event';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';
import { ProfilePage } from '../profile/profile';
import { EditEventPage } from '../edit-event/edit-event';
import { GoogleMapServiceProvider } from '../../providers/google-map-service/google-map-service';

@IonicPage()
@Component({
  selector: 'page-business-user',
  templateUrl: 'business-user.html',
})
export class BusinessUserPage {

  private user: User = {} as User;
  private dealEvents: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public eventService: EventServiceProvider,
              public mapService: GoogleMapServiceProvider) {
    this.userService.getCurrentUser().subscribe(u => this.user = u as User);
    this.dealEvents = this.eventService.getEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessUserPage');
  }

  redirectToAddEventPage(){
    this.navCtrl.push(AddDealEventPage);
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

  redirectToProfilePage(){
    this.navCtrl.push(ProfilePage);
  }

  editDealEvent(dealEvent: DealEvent){
    this.navCtrl.push(EditEventPage, {
      data: dealEvent
    })
  }

  deleteDealEvent(eventId: string){
    this.eventService.deleteEvent(eventId);
  }

  getAttendeesCount(dealEvent: DealEvent): string{
    if(!dealEvent.attendees) return "Waiting for responses...";
    let count = Object.keys(dealEvent.attendees).length;

    if(count == 1) return "1 is attending";
    return count + " are attending"
  }

}
