import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataManagerProvider} from "../../providers/data-manager/data-manager";


@Component({
  selector: 'page-edit-sample',
  templateUrl: 'edit-sample.html'
})
export class EditSamplePage {

  constructor(public navCtrl: NavController, public dataManager: DataManagerProvider) {

  }

  items: ["<ion-item>Angola</ion-item>","so","cool"];

}
