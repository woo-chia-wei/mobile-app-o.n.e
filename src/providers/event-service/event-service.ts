import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserServiceProvider } from '../user-service/user-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { DealEvent } from '../../models/event';
import * as moment from 'moment';

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

}
