var config = {
    apiKey: "AIzaSyBHY8xa-Rycqf__UeoGk1kfxksfwed-MsM",
    authDomain: "mobile-assignment-fa43d.firebaseapp.com",
    databaseURL: "https://mobile-assignment-fa43d.firebaseio.com",
    projectId: "mobile-assignment-fa43d",
    storageBucket: "mobile-assignment-fa43d.appspot.com",
    messagingSenderId: "516750291967"
};

var events = require('./test/events.json')
var firebase = require('firebase');
firebase.initializeApp(config);

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
        "category": data.category
    };

    var record = firebase.database().ref('dealEvents').push(new_data);
    record.update({id: record.key})
    console.log("Added event record with key " + record.key);
}

events.forEach(addEvent);
firebase.database().goOffline()









