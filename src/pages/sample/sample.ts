import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-sample',
  templateUrl: 'sample.html'
})
export class SamplePage {

  constructor(public navCtrl: NavController) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

}
