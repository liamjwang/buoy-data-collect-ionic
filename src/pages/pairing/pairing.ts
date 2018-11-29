import {Component, NgZone} from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';

import {WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import {LiveviewPage} from "../liveview/liveview";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController,
              private bleapi: WaterwandBleApiProvider,
              private zone: NgZone,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

  }

  devices: any[] = [];

  doRefresh(refresher) {
    this.scanForDevices();

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  scanForDevices() {
    let firstDeviceFlag = false;
    this.bleapi.ble.scan(["6e400001-b5a3-f393-e0a9-e50e24dcca9e"], 1).subscribe((device) => {
      if (!firstDeviceFlag) {
        firstDeviceFlag = true;
        this.devices = [];
      }
      console.log(device);
      this.zone.run(() => {
        this.devices.push(device);
      });
    }, this.onError);
  }

  onError(reason) {
    alert("ERROR: " + JSON.stringify(reason)); // real apps should use notification.alert
  }

  connect(device) {
    this.navCtrl.push(LiveviewPage, {deviceID: device.id});
  }

  ionViewDidEnter() {
    this.scanForDevices();
  }
}
