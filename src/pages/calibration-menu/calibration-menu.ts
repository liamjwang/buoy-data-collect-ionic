import {Component, NgZone} from '@angular/core';
import {AlertController, LoadingController, ToastController, ViewController} from 'ionic-angular';
import {RawSample} from "../../app/classes/raw-sample";
import {WaterwandBleApiProvider} from "../../providers/waterwand-ble-api/waterwand-ble-api";

@Component({
  selector: 'page-calibration-menu',
  templateUrl: 'calibration-menu.html',
})
export class CalibrationMenuPage {

  constructor(public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private bleapi: WaterwandBleApiProvider,
              private zone: NgZone,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }


  saveSample() {
    this.viewCtrl.dismiss();
  }

  calibrateSalinity() {
    let alert = this.alertCtrl.create({
      title: 'Salinity Calibration',
      message: 'Place the WaterWand salinity sensor in distilled water, then press next',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Next',
          handler: () => {
            this.bleapi.getData((rawSample: RawSample) => {
              this.bleapi.writeToEEPROM(3, rawSample.salinity, () => {

                let noDataToast = this.toastCtrl.create({
                  message: 'Salinity Calibration Complete',
                  duration: 2000,
                  position: 'bottom'
                });

                noDataToast.present();
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

  calibrateTurbidity() {
    let alert = this.alertCtrl.create({
      title: 'Turbidity Calibration',
      message: 'Place the WaterWand turbidity sensor in distilled water, then press next',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Next',
          handler: () => {
            this.bleapi.getData((rawSample: RawSample) => {
              this.bleapi.writeToEEPROM(0, rawSample.turbidity, () => {

                let noDataToast = this.toastCtrl.create({
                  message: 'Turbidity Calibration Complete',
                  duration: 2000,
                  position: 'bottom'
                });

                noDataToast.present();
              });
            });
          }
        }
      ]
    });
    alert.present();
  }

  calibratePh() {
    let alert = this.alertCtrl.create({
      title: 'pH Calibration',
      message: 'Place the WaterWand ph sensor in distilled water, then press next',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Next',
          handler: () => {
            this.bleapi.getData((rawSample: RawSample) => {
              this.bleapi.writeToEEPROM(1, rawSample.ph, () => {

                let noDataToast = this.toastCtrl.create({
                  message: 'pH Calibration Complete',
                  duration: 2000,
                  position: 'bottom'
                });

                noDataToast.present();
              });
            });
          }
        }
      ]
    });
    alert.present();
  }


  calibratePhVoltage() {
    let alert = this.alertCtrl.create({
      title: 'pH Voltage Calibration',
      message: 'Apply 3v to the input of the pH voltage divider, then press next',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Next',
          handler: () => {
            this.bleapi.getData((rawSample: RawSample) => {
              this.bleapi.writeToEEPROM(2, rawSample.ph, () => {

                let noDataToast = this.toastCtrl.create({
                  message: 'pH Calibration Complete',
                  duration: 2000,
                  position: 'bottom'
                });

                noDataToast.present();
              });
            });
          }
        }
      ]
    });
    alert.present();
  }
}
