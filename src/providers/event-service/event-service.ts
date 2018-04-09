import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserServiceProvider } from '../user-service/user-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DealEvent } from '../../models/event';
import * as moment from 'moment';
import { EVENTS_DATA } from '../../test/events'

@Injectable()
export class EventServiceProvider {

  constructor(public userService: UserServiceProvider,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
    console.log('Hello EventServiceProvider Provider');
  }

  addEvent(dealEvent: DealEvent){
    let record = this.db.list('dealEvents').push(dealEvent);
    record.update({id: record.key});
  }

  getEvents(){
    return this.db.list('dealEvents', ref=>ref.orderByChild('ownerId').equalTo(this.userService.getCurrentUserId())).valueChanges();
  }

  deleteEvent(eventId: string){
    return this .db.object('dealEvents/' + eventId).remove();
  }

  addTestData(){
    EVENTS_DATA.forEach(data => {
      let new_data = {
        "id": "",
        "title": data.title,
        "description": data.description,
        "address": data.address,
        "url": data.url,
        "postalCode": data.postalCode.toString(),
        "longitude": 0,
        "latitude": 0,
        "ownerId": data.ownerId,
        "startTime": new Date(data.startTime).getTime(),
        "endTime": new Date(data.endTime).getTime(),
        "category": data.category
      };

      this.addEvent(new_data);
    });
  }

}
