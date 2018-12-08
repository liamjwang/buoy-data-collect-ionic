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
  static readCBarr: ({addr: number, cb: (value: number) => void})[] = [];
  static writeCBarr: ({addr: number, cb: () => void})[] = [];

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
  } // TODO: Make sure connected before anything else

  private onData(data) {
    let datastring = String.fromCharCode.apply(null, new Uint8Array(data));

    if (datastring.slice(0, 1) === "s") { // Incoming Sample
      let lastCallback = WaterwandBleApiProvider.sampleCBarr.pop();
      if (lastCallback === undefined) {
        return;
      }
      lastCallback(
        new RawSample(
          parseInt(datastring.slice(1,3), 16),
          parseInt(datastring.slice(3,5), 16),
          parseInt(datastring.slice(5,7), 16),
          parseInt(datastring.slice(7,9), 16)
        )
      );
    } else {
      let addr = parseInt(datastring.slice(1, 3), 16);

      if (datastring.slice(0, 1) === "w") { // Incoming Sample
        let foundCallbacks = WaterwandBleApiProvider.writeCBarr.filter(obj => {return obj.addr===addr});
        WaterwandBleApiProvider.writeCBarr = WaterwandBleApiProvider.writeCBarr.filter(obj => {return obj.addr!==addr});
        if (foundCallbacks.length == 0) {
          console.log("[BLE] Error Write: unable to find callback with addr: "+addr+" Datastr: "+datastring);
        }
        foundCallbacks.forEach(cb => {
          cb.cb();
        });

      } else if (datastring.slice(0, 1) === "r") { // Incoming Sample
        let foundCallbacks = WaterwandBleApiProvider.readCBarr.filter(obj => {return obj.addr===addr});
        WaterwandBleApiProvider.readCBarr = WaterwandBleApiProvider.readCBarr.filter(obj => {return obj.addr!==addr});
        if (foundCallbacks.length == 0) {
          console.log("[BLE] Error Read: unable to find callback with addr: "+addr+" Datastr: "+datastring);
        }
        foundCallbacks.forEach(cb => {
          cb.cb(
            new Float32Array(new Uint8Array([
              parseInt(datastring.slice(3, 5), 16),
              parseInt(datastring.slice(5, 7), 16),
              parseInt(datastring.slice(7, 9), 16),
              parseInt(datastring.slice(9, 11), 16)
            ]).buffer)[0]
          );
        });
      } else {
        console.log('[BLE] Unknown data type: ' + datastring);
      }
    }

  }

  private write(value: ArrayBuffer): Promise<any> {
    if (!this.isConnected()) {
      return Promise.reject("Device disconnected, unable to write");
    }
    return this.ble.write(WaterwandBleApiProvider.deviceId, this.serviceUUID, this.txCharacteristic, value);
  }

  readFromEEPROM(addr: number, callback: (value: number) => void, reject: (error) => void) {
    WaterwandBleApiProvider.readCBarr.push({addr: addr, cb: callback}); // TODO: Reject after timeout

    let addressBytes = new Uint8Array(1);
    addressBytes[0] = addr;

    let str = "r" + WaterwandBleApiProvider.toHexString(new Uint8Array(addressBytes.buffer));
    let code = new Array(str.length);
    for(var i=0;i<str.length;i++){
      code[i]=str.charCodeAt(i);
    }

    this.write(new Uint8Array(code).buffer).catch(e=>reject(e));
  }

  writeToEEPROM(addr: number, value: number, callback: () => void, reject: (error) => void) {
    WaterwandBleApiProvider.writeCBarr.push({addr: addr, cb: callback}); // TODO: Reject after timeout

    var addressBytes = new Uint8Array(1);
    addressBytes[0] = addr;

    var valueBytes = new Float32Array(1);
    valueBytes[0] = value;

    let str = "w" + WaterwandBleApiProvider.toHexString(new Uint8Array(addressBytes.buffer)) + WaterwandBleApiProvider.toHexString(new Uint8Array(valueBytes.buffer));
    let code = new Array(str.length);
    for(let i=0; i<str.length; i++){
      code[i]=str.charCodeAt(i);
    }

    this.write(new Uint8Array(code).buffer).catch(e=>reject(e));
  }
  static toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }
  getData(resolve: (sample: RawSample) => void, reject: (error: string) => void) { // TODO: Add catch for rejected attempts to get data
    let input = new ArrayBuffer(1);
    let byteView = new Uint8Array(input);
    byteView[0] = 115;
    WaterwandBleApiProvider.sampleCBarr.push(resolve);
    this.write(input).catch(e=> {
      reject("[BLE] Error getting data!");
    });
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

