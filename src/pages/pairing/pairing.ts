import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SamplePage } from "../sample/sample";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

  pair() {
    this.navCtrl.push(SamplePage)
  }

}
