## About
Assignment for SG4207 Mobile Wireless Solution Design, this is a platform allows business user to create deal events and consumer (normal user) is able to search the nearby deals based on the current location.

## Instructions
1. If Ionic & Cordova were not installed previously, please run `npm install -g --save ionic cordova`.   
2. Run `npm install` to setup the node modules for all dependencies.
3. Run `ionic serve` to start the server, the application be will be launched in default browser (recommend chrome)

## Troubleshotting
You might get error message like:  
`Class 'FirebaseApp' incorrectly implements interface 'FirebaseApp'.`  
`Property 'automaticDataCollectionEnabled' is missing in type 'FirebaseApp'.`  

The solution is to add property automaticDataCollectionEnabled to the FirebaseApp class which is located in `node_modules/angularfire2/firebase.app.module.d.ts`. The source is from [stack overflow](https://stackoverflow.com/questions/49934097/angular-firebase-build-error-when-try-ionic-build).

## Screenshots
#### Authentication & Identity
<p align="center"> 
	<img src="https://github.com/woo-chia-wei/mobile-assignment-prototype/blob/master/public/images/image_001.png" width="318" height="555" style="float:left,padding:50px">
	<img src="https://github.com/woo-chia-wei/mobile-assignment-prototype/blob/master/public/images/image_002.png" width="318" height="555" style="float:right,padding:50px"">
</p>