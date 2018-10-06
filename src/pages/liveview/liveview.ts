import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SamplePage } from "../sample/sample";

@Component({
  selector: 'page-liveview',
  templateUrl: 'liveview.html'
})
export class LiveviewPage {

  constructor(public navCtrl: NavController) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

  saveSample() {
    this.navCtrl.push(SamplePage)
  }
}
