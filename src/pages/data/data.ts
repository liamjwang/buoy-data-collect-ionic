import {Component} from '@angular/core';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import {EditSamplePage} from "../edit-sample/edit-sample";
import {DataManagerProvider} from "../../providers/data-manager/data-manager";
import {LoadingController} from "ionic-angular";

@Component({
  selector: 'page-data',
  templateUrl: 'data.html'
})
export class DataPage {

  constructor(public navCtrl: NavController,
              public dataManager: DataManagerProvider,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
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

  openSample(id) {
    this.navCtrl.push(EditSamplePage, {sampleID: id});
  }

  uploadAll() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Upload',
      message: 'All samples stored on this device will be uploaded to the central database over wifi or cellular data. ' +
        'Samples will be removed from this device and cannot be edited later.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            let cancelToast = this.toastCtrl.create({
              message: 'Upload cancelled!',
              duration: 2000,
              position: 'top'
            });

            cancelToast.present();
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Uploading...'
            });

            loading.present().then(() => {
              setTimeout(() => {

                this.dataManager.deleteAll().then(() => {
                  this.ionViewDidEnter();
                });
                let completeToast = this.toastCtrl.create({
                  message: 'Upload complete!',
                  duration: 2000,
                  position: 'top'
                });

                loading.dismiss().then(() => completeToast.present());
              }, 2000)
            })
          }
        }
      ]
    });
    alert.present();
  }
}
