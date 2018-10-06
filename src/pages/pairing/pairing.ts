import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LiveviewPage } from "../liveview/liveview";

@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {

  constructor(public navCtrl: NavController) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

  pair() {
    this.navCtrl.push(LiveviewPage)
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 9000);
  }

}
