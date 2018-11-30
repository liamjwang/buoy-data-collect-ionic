import {Component, NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataManagerProvider} from "../../providers/data-manager/data-manager";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'page-edit-sample',
  templateUrl: 'edit-sample.html'
})
export class EditSamplePage {

  sampleID: number;

  name: string;
  description: string;
  salinity: number;
  turbidity: number;
  ph: number;
  temperature: number;
  timestamp: string;
  latitude: number;
  longitude: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private zone: NgZone,
              private dataManager: DataManagerProvider) {
    this.sampleID = this.navParams.get("sampleID");
    this.openSample();
  }

  openSample(): Promise<any> {
    return this.dataManager.getSampleByID(this.sampleID).then(sample => {
      console.log("[EditSample] Info: Got sample: "+JSON.stringify(sample));
      this.zone.run(() => {
        this.name = sample.name;
        this.description = sample.description;
        this.salinity = sample.salinity;
        this.turbidity = sample.turbidity;
        this.ph = sample.ph;
        this.temperature = sample.temperature;
        let timestampDate = new Date(sample.timestamp);
        this.timestamp = timestampDate.toLocaleDateString()+"  "+timestampDate.toLocaleTimeString();
        this.latitude = sample.latitude;
        this.longitude = sample.longitude;
      });
    })
  }

  deleteSample() {
    this.dataManager.deleteSampleByID(this.sampleID).then(() => this.navCtrl.pop());
  }

  // on view start
  // if can get, update
  // otherwise, pop
}
