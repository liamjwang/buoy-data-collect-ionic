import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import { SamplePage } from "../sample/sample";
import {RawSample} from "../../app/classes/raw-sample";

@Component({
  selector: 'page-liveview',
  templateUrl: 'liveview.html'
})
export class LiveviewPage {

  constructor(public navCtrl: NavController, private bleapi: WaterwandBleApiProvider) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

  saveSample() {
    this.bleapi.getData((rawSample: RawSample) => {
      console.log("got data")
    });
    // this.navCtrl.push(SamplePage)
  }
}
