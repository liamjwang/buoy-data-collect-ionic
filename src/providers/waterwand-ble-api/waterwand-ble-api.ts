import {BLE} from '@ionic-native/ble';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {RawSample} from "../../app/classes/raw-sample";

declare type sampleCB = (sample: RawSample) => void;


@Injectable()
export class WaterwandBleApiProvider {

  readonly serviceUUID: string =      "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  readonly txCharacteristic: string = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  readonly rxCharacteristic: string = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  constructor(public ble: BLE) {
  }

  deviceId: string;

  connect(deviceId: string): Observable<any> {
    this.deviceId = deviceId;
    var obs: Observable<any> = this.ble.connect(deviceId); // connect to ble device
    obs.subscribe(
      () => this.ble.startNotification(deviceId, // automatically start listening when subscribed
        this.serviceUUID, // from adafruit website
      this.rxCharacteristic)
      .subscribe(this.onData, this.onError)
    );
    return obs; // pass observable
  }

  sampleCBarr: sampleCB[] = [];
  private onData(data) {
    console.log("Recieved Data: ");
    console.log(JSON.stringify(data));

  }

  private onError(data) {
    console.log("Error: ");
    console.log(JSON.stringify(data));
  }

  private write(value: ArrayBuffer): Promise<any> {
    return this.ble.write(this.deviceId, this.serviceUUID, this.txCharacteristic, value);
  }


  getData(callback: sampleCB) {
    let input = new ArrayBuffer(1);
    let byteView = new Uint8Array(input);
    byteView[0] = 115;
    this.write(input).then((rawSampleArray: string) => {
      console.log();
      console.log(JSON.stringify(rawSampleArray));
      // let rawSample = new RawSample();

    })
  }
}

