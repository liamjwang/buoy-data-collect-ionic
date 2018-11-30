import {Component, NgZone} from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';

import {WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

import {RawSample} from "../../app/classes/raw-sample";
import {Observable, Subscription} from "rxjs";
import {EditSamplePage} from "../edit-sample/edit-sample";
import {DataManagerProvider} from "../../providers/data-manager/data-manager";
import { Geolocation } from '@ionic-native/geolocation';


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
              private toastCtrl: ToastController,
              private geolocation: Geolocation,
              private dataManager: DataManagerProvider) {
    this.deviceID = this.navParams.get("deviceID");
  }

  liveSample: RawSample;
  liveUpdateSubscription: Subscription;

  saveSample() {
    this.geolocation.getCurrentPosition().then(data => { // TODO: If geolocation doesnt work, alert them to it and take anyways
      return this.dataManager.addSample(
        this.liveSample.salinity,
        this.liveSample.turbidity,
        this.liveSample.ph,
        this.liveSample.temperature,
        new Date().getTime(),
        data.coords.latitude,
        data.coords.longitude,
      )
    }).then(e => {
      let profileModal = this.modalCtrl.create(EditSamplePage, {sampleID: e});
      return profileModal.present();
    }).catch((error) => {
      console.log('[LiveView] Error getting location', JSON.stringify(error));
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
        loading.dismiss();
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
  }

  kickToPairing(): Promise<any> {
    let disconnectedToast = this.toastCtrl.create({
      message: 'Unable to connect to device! Reboot the WaterWand or try again later.',
      duration: 3000,
      position: 'top'
    });

    return disconnectedToast.present().then(() => {
      return this.navCtrl.pop()
    }).catch(e => console.log("[Kicking] Error: " + JSON.stringify(e)));
  }
}
