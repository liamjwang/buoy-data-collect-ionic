import {Component, NgZone} from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';

import {WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import {RawSample} from "../../app/classes/raw-sample";
import {Observable, Subscription} from "rxjs";
import {EditSamplePage} from "../edit-sample/edit-sample";
import {DataManagerProvider} from "../../providers/data-manager/data-manager";

@Component({
  selector: 'page-liveview',
  templateUrl: 'liveview.html'
})
export class LiveviewPage {

  deviceID: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private bleapi: WaterwandBleApiProvider,
              private zone: NgZone,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private dataManager: DataManagerProvider) {
    this.deviceID = this.navParams.get("deviceID");
  }

  liveSample: RawSample;
  liveUpdateSubscription: Subscription;

  saveSample() {
    this.dataManager.addSample(
      this.liveSample.salinity,
      this.liveSample.turbidity,
      this.liveSample.ph,
      this.liveSample.temperature,
      new Date().getTime(),
      3.14,
      2.78,
    ).then(e => {
      let profileModal = this.modalCtrl.create(EditSamplePage, {sampleID: e});
      return profileModal.present();
    });
  }

  ionViewDidLeave() {
    if (this.liveUpdateSubscription !== undefined) {
      this.liveUpdateSubscription.unsubscribe();
    }
    this.bleapi.disconnect();
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Connecting...'
    });

    loading.present().then(() => {

      let pairTimeout = setTimeout(() => {
        this.kickToPairing().then(() => {
          return loading.dismiss();
        });
      }, 5000);

      this.bleapi.connect(this.deviceID, (success) => {
        loading.dismiss().then(() => {
          clearTimeout(pairTimeout);
          if (success) {
            this.liveUpdateSubscription = Observable.interval(100).subscribe(() => {
              this.bleapi.getData((rawSample: RawSample) => {
                this.zone.run(() => {
                  this.liveSample = rawSample;
                });
              });
            });
          } else {
            return this.kickToPairing();
          }
        });
      });
    });
  }

  kickToPairing(): Promise<any> {
    return this.navCtrl.pop().then(() => {
      let alert = this.alertCtrl.create({
        title: 'Connection Error',
        subTitle: 'Unable to connect! Try rebooting the WaterWand device.',
        buttons: ['Dismiss']
      });
      return alert.present();
    }).catch(e => console.log("[Kicking] Error: " + JSON.stringify(e)));
  }
}
