import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {EditSamplePage} from "../edit-sample/edit-sample";
import {DataManagerProvider} from "../../providers/data-manager/data-manager";

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController, public dataManager: DataManagerProvider) {
    this.allData = this.dataManager.allData;
  }

  allData: any[];

  openSample (id) {
    this.dataManager.selected = id;
    this.navCtrl.push(EditSamplePage);
  }

}
