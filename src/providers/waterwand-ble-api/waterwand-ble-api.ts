import {BLE} from '@ionic-native/ble';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {RawSample} from "../../app/classes/raw-sample";


@Injectable()
export class WaterwandBleApiProvider {

  readonly serviceUUID: string =      "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  readonly txCharacteristic: string = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  readonly rxCharacteristic: string = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  constructor(public ble: BLE) {
  }

  static deviceId: string;
  static sampleCBarr: ((sample: RawSample) => void)[] = [];

  connect(deviceId: string, onConnect: (success: boolean) => void): void { // TODO: Return an observable
    WaterwandBleApiProvider.deviceId = deviceId;
    var obs: Observable<any> = this.ble.connect(deviceId); // connect to ble device
    obs.subscribe(
      () => {
        this.ble.startNotification(deviceId, // automatically start listening when subscribed
          this.serviceUUID, // from adafruit website
          this.rxCharacteristic)
          .subscribe(this.onData, e => console.log("[BLE] Error: "+JSON.stringify(e)));
        console.log("[BLE] Info: Connection established to device with id "+WaterwandBleApiProvider.deviceId);
        onConnect(true);
      }, () => {
          onConnect(false);
        }
    );
  }

  private onData(data) {
    let datastring = String.fromCharCode.apply(null, new Uint8Array(data));

    if (datastring.slice(0, 1) === "s") { // Incoming Sample
      WaterwandBleApiProvider.sampleCBarr.pop()(
        new RawSample(
          parseInt(datastring.slice(1,3), 16),
          parseInt(datastring.slice(3,5), 16),
          parseInt(datastring.slice(5,7), 16),
          parseInt(datastring.slice(7,9), 16)
        )
      );
    } else {
      console.log('[BLE] Unknown data type: '+datastring);
    }

  }

  private write(value: ArrayBuffer): Promise<any> {
    return this.ble.write(WaterwandBleApiProvider.deviceId, this.serviceUUID, this.txCharacteristic, value);
  }

  getData(callback: (sample: RawSample) => void) {
    let input = new ArrayBuffer(1);
    let byteView = new Uint8Array(input);
    byteView[0] = 115;
    WaterwandBleApiProvider.sampleCBarr.push(callback);
    this.write(input);
  }

  disconnect() {
    console.log("[BLE] Info: Disconnecting from device with id "+WaterwandBleApiProvider.deviceId);
    this.ble.disconnect(WaterwandBleApiProvider.deviceId);
    WaterwandBleApiProvider.deviceId = null;
  }

  isConnected(): boolean {
    return WaterwandBleApiProvider.deviceId !== null;
  }
}

