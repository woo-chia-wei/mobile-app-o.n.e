import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CATEGORIES } from '../../shared/references';
import { EventServiceProvider } from '../../providers/event-service/event-service';
import { DealEvent } from '../../models/event';

@IonicPage()
@Component({
  selector: 'page-normal-user',
  templateUrl: 'normal-user.html',
})
export class NormalUserPage {

  private categories: string[] = CATEGORIES;
  private categoryFilter: string;
  private radiusFilter: number = 1;
  private dealEvents: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public eventService: EventServiceProvider) {
    this.categoryFilter = this.categories[0];
    this.dealEvents = this.eventService.getEventsForCustomer(this.categoryFilter, this.radiusFilter);
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

}
