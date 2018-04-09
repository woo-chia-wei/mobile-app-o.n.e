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

@IonicPage()
@Component({
  selector: 'page-business-user',
  templateUrl: 'business-user.html',
})
export class BusinessUserPage {

  private user: User = {} as User;
  private dealEvents: any

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public eventService: EventServiceProvider) {
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
      return 'Opening';
    }else if(today > dealEvent.endTime){
      return 'Closed';
    }else{
      return 'Soon';
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

  truncate(text: string){
    if(text.length > 30){
      return text.substring(0, 27) + '...';
    }

    return text;
  }

}
