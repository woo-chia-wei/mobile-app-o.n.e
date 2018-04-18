var config = {
    apiKey: "AIzaSyA7YYPq32MmUR9Gszt7U3slI2xJkKjQJrI",
    authDomain: "mobile-assignment-2-e12de.firebaseapp.com",
    databaseURL: "https://mobile-assignment-2-e12de.firebaseio.com",
    projectId: "mobile-assignment-2-e12de",
    storageBucket: "",
    messagingSenderId: "187444583221"
  };

var events = require('./data/events.json')
var firebase = require('firebase');
firebase.initializeApp(config);

//Delete all event records
firebase.database().ref('dealEvents').remove();
console.log('Deleted all event records');

//Add new events from local JSON
var addEvent = function(data){
    var new_data = {
        "id": "",
        "title": data.title,
        "description": data.description,
        "address": data.address,
        "url": data.url,
        "postalCode": data.postalCode.toString(),
        "longitude": data.longitude,
        "latitude": data.latitude,
        "ownerId": data.ownerId,
        "startTime": new Date(data.startTime).getTime(),
        "endTime": new Date(data.endTime).getTime(),
        "category": data.category,
        "createdTime": new Date().getTime()
    };

    var record = firebase.database().ref('dealEvents').push(new_data);
    record.update({id: record.key})
    console.log("Added event record with key " + record.key);
}

events.forEach(addEvent);


setTimeout(() => firebase.database().goOffline(), 2000);









