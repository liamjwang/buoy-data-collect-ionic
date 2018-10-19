import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {BLE} from '@ionic-native/ble';

import {LiveviewPage} from "../liveview/liveview";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController, private ble: BLE) {

  }

  items: ["<ion-item>Angola</ion-item>", "so", "cool"];

  devices: any[] = [];

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    let firstDeviceFlag = false;
    this.ble.scan(["6e400001-b5a3-f393-e0a9-e50e24dcca9e"], 5).subscribe((device) => {
      if (!firstDeviceFlag) {
        firstDeviceFlag = true;
        this.devices = [];
      }
      console.log(device);
      this.devices.push(device);
    }, this.onError);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 5000);
  }

  onError(reason) {
    alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
  }

  connect(device) {
    this.navCtrl.push(LiveviewPage);
    //
    // console.log("Attempting to connect to device with id " + device.id);
    // var deviceId = device.id;
    //
    //
    // this.ble.connect(deviceId).subscribe((peripheral) => {
    //   {
    //     console.log("Connected!");
    //     console.log(peripheral);
    //
    //     // // subscribe for incoming data
    //     // this.ble.startNotification(deviceId,
    //     //   "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    //     //   "6e400003-b5a3-f393-e0a9-e50e24dcca9e")
    //     //   .subscribe(this.onData, this.onError);
    //     this.navCtrl.push(LiveviewPage);
    //   }
    // }, this.onError);
  }

  onData(data) { // data received from Arduino
    console.log(data);
  }
}
