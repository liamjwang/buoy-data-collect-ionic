import {Component} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from 'ionic-angular';
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
              public modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    this.refreshData()
  }

  private refreshData() {
    this.dataManager.getAllData().then(data => {
      this.allData = data;
    }).catch(e => {
      console.log(JSON.stringify("[DataPage] Error: " + JSON.stringify(e)));
    });
  }

  allData: any[] = [];

  openSample(id) {
    let profileModal = this.modalCtrl.create(EditSamplePage, {sampleID: id});
    return profileModal.present().then(() => {
      profileModal.onWillDismiss(() => {
        this.refreshData();
      })
    });

  }

  uploadAll() {
    if (this.allData.length === 0) {
      let noDataToast = this.toastCtrl.create({
        message: 'No data to upload!',
        duration: 2000,
        position: 'top'
      });

      noDataToast.present();
      return;
    }

    let alert = this.alertCtrl.create({
      title: 'Upload Confirmation',
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
