import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditSamplePage } from "../edit-sample/edit-sample";
import { DataManagerProvider } from "../../providers/data-manager/data-manager";

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController, public dataManager: DataManagerProvider) {
    this.dataManager.getAllData(d => this.allData = d);
  }

  allData: any[];

  openSample (id) {
    this.navCtrl.push(EditSamplePage);
  }

}
