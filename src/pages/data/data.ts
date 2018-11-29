import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditSamplePage } from "../edit-sample/edit-sample";
import { DataManagerProvider } from "../../providers/data-manager/data-manager";
import {LoadingController} from "ionic-angular";

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController, public dataManager: DataManagerProvider, private loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    this.dataManager.initDb().then(() => {
      return this.dataManager.getAllData()
    }).then(data => {
      this.allData = data;
      // loading.dismiss();
    }).catch(e => {
      // loading.dismiss();
      return console.log(JSON.stringify("DataPage" + e));
    });
  }

  allData: any[] = [];

  openSample (id) {
    console.log("[Data] Opening sample with id: "+id);
    this.navCtrl.push(EditSamplePage, {sampleID: id});
  }
}
