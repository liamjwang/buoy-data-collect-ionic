import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { EditSamplePage } from "../edit-sample/edit-sample";
import { DataManagerProvider } from "../../providers/data-manager/data-manager";
import {LoadingController} from "ionic-angular";

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController,
              public dataManager: DataManagerProvider,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    this.dataManager.initDb().then(() => {
      return this.dataManager.getAllData()
    }).then(data => {
      this.allData = data;
    }).catch(e => {
      console.log(JSON.stringify("[DataPage] Error: " + JSON.stringify(e)));
    });
  }

  allData: any[] = [];

  openSample (id) {
    this.navCtrl.push(EditSamplePage, {sampleID: id});
  }

  uploadAll() {
    let loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    loading.present().then(() => {
      setTimeout(() => {
        loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: 'Upload Complete',
            subTitle: 'Thank you! Your samples have been uploaded to the database.',
            buttons: ['Done']
          });
          return alert.present();
        });
      }, 2000)
    })
  }
}
