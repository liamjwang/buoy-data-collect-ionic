import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import {LiveviewPage} from "../liveview/liveview";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController,
              private bleapi: WaterwandBleApiProvider) {
  }

  devices: any[] = [];

  doRefresh(refresher) {
    this.scanForDevices();

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  refreshLock: boolean = false;
  scanForDevices() {
    if (this.refreshLock) {
      return;
    }
    this.refreshLock = true;
    let newDevices = [];
    this.bleapi.ble.scan(["6e400001-b5a3-f393-e0a9-e50e24dcca9e"], 1).subscribe((device) => {
      newDevices.push(device)
    });

    setTimeout(() => {
      this.devices = newDevices;
      this.refreshLock = false;
    }, 1000);
  }

  connect(device) {
    this.navCtrl.push(LiveviewPage, {deviceID: device.id});
  }

  ionViewDidEnter() {
    this.scanForDevices();
  }
}
