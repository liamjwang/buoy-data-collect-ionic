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
import {CalibrationMenuPage} from "../calibration-menu/calibration-menu";


@Component({
  selector: 'page-liveview',
  templateUrl: 'liveview.html'
})
export class LiveviewPage {

  deviceID: string;
  turbidityCalibration: number = 0;
  phVDCalibration: number = 0;
  phOffsetCalibration: number = 0;
  salinityScaleCalibration: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private bleapi: WaterwandBleApiProvider,
              private zone: NgZone,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private geolocation: Geolocation,
              private dataManager: DataManagerProvider) {
    this.deviceID = this.navParams.get("deviceID");
  }
  displayDate: string;

  liveSample: RawSample;
  liveUpdateSubscription: Subscription;

  updateCalibrationValues(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bleapi.readFromEEPROM(0, num => {
        this.turbidityCalibration = num;
        this.bleapi.readFromEEPROM(1, num => {
          this.phOffsetCalibration = num;
          this.bleapi.readFromEEPROM(2, num => {
            this.phVDCalibration = num;
            this.bleapi.readFromEEPROM(3, num => {
              this.salinityScaleCalibration = num;
              console.log("[Liveview] Assigned calibration values");
              resolve();
            });
          });
        });
      });
    });
  }

  saveSample() {
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000
    }).then(data => { // TODO: If geolocation doesnt work, alert them to it and take anyways
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
      if (error.code === 1) {
        console.log('[LiveView] Location permission denied: ', JSON.stringify(error));
        let alert = this.alertCtrl.create({
          title: 'Location Error',
          message: 'We were unable to retrieve your location in order to geotag this sample. ' +
            'Please change your settings to allow this app location access. ' +
            'Note: If you choose to take a sample without a location, you must specify exactly where the sample was taken.',
          buttons: [
          {
            text: 'Sample Without Location',
            handler: () => {
              this.dataManager.addSample(
                this.liveSample.salinity,
                this.liveSample.turbidity,
                this.liveSample.ph,
                this.liveSample.temperature,
                new Date().getTime(),
              ).then(e => {
                let profileModal = this.modalCtrl.create(EditSamplePage, {sampleID: e});
                return profileModal.present();
              })
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
        });
        alert.present();
      } else {
        console.log('[LiveView] Unknown error when getting location: ', JSON.stringify(error));
      }
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
        console.log("[LiveView] Pairing timeout");
        this.kickToPairing().then(() => {
          return loading.dismiss();
        });
      }, 5000);

      this.bleapi.connect(this.deviceID, (success) => {
        clearTimeout(pairTimeout);
        loading.dismiss();
        if (success) {
          this.updateCalibrationValues().then(() => {
            console.log("[LiveView] Starting live update");
            this.liveUpdateSubscription = Observable.interval(500).subscribe(() => {
              this.bleapi.getData((rawSample: RawSample) => {
                this.zone.run(() => {
                  let rawTurbidityScaled = rawSample.turbidity/this.turbidityCalibration;
                  let turbidityAfterFormula = -4352.9 + 24117.7*rawTurbidityScaled - 19763.9 *rawTurbidityScaled*rawTurbidityScaled;
                  this.liveSample = new RawSample(
                    rawSample.salinity/255*30,
                    Math.round(rawTurbidityScaled<0.61?3000:rawTurbidityScaled>1?0:turbidityAfterFormula),
                    rawSample.ph/this.phVDCalibration*3*3.5,
                    Math.round(this.scale(rawSample.temperature, 0, 255, 0, 85)*10)/10,
                  );
                  this.liveSample.generateStrings();
                });
              });
            });
          });
        } else {
          return this.kickToPairing();
        }
      });
    });
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  kickToPairing(): Promise<any> {
    let disconnectedToast = this.toastCtrl.create({
      message: 'Unable to connect to device! Please try again later.',
      duration: 3000,
      position: 'top'
    });

    return disconnectedToast.present().then(() => {
      return this.navCtrl.pop()
    }).catch(e => console.log("[Kicking] Error: " + JSON.stringify(e)));
  }

  openCalibration() {
    let calibrationModal = this.modalCtrl.create(CalibrationMenuPage);
    calibrationModal.onWillDismiss(() => {
      this.ionViewWillEnter();
    });
    return calibrationModal.present();
  }
}
