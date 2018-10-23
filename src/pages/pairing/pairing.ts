import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import { WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import {LiveviewPage} from "../liveview/liveview";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController, private bleapi: WaterwandBleApiProvider) {

  }

  items: ["<ion-item>Angola</ion-item>", "so", "cool"];

  devices: any[] = [];

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    let firstDeviceFlag = false;
    this.bleapi.ble.scan(["6e400001-b5a3-f393-e0a9-e50e24dcca9e"], 5).subscribe((device) => {
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
    }, 2000);
  }

  onError(reason) {
    alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
  }

  connect(device) {
    this.navCtrl.push(LiveviewPage);

    console.log("Attempting to connect to device with id " + device.id);
    var deviceId = device.id;


    this.bleapi.connect(deviceId).subscribe((peripheral) => {
      {
        console.log("Connected!");
        console.log(peripheral);
        this.navCtrl.push(LiveviewPage);
      }
    }, this.onError);
  }
}
