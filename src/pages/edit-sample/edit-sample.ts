import {Component, NgZone} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {DataManagerProvider} from "../../providers/data-manager/data-manager";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-edit-sample',
  templateUrl: 'edit-sample.html',
})
export class EditSamplePage {

  sampleID: number;

  sample: any = {};
  timestampString: string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private zone: NgZone,
              private dataManager: DataManagerProvider) {
    this.sampleID = this.navParams.get("sampleID");
    this.sample.name = "";
    this.sample.description = "";

    this.openSample();
  }

  openSample(): Promise<any> {
    return this.dataManager.getSampleByID(this.sampleID).then(sample => {
      this.zone.run(() => {
        this.sample = sample;
        let timestampDate = new Date(sample.timestamp);
        this.timestampString = timestampDate.toLocaleDateString()+"  "+timestampDate.toLocaleTimeString();
      });
    })
  }

  deleteSample() {
    this.dataManager.deleteSampleByID(this.sampleID).then(() => this.navCtrl.pop());
  }

  saveSample() {
    this.dataManager.updateSampleNameDescription(this.sampleID, this.sample.name, this.sample.description);
    this.viewCtrl.dismiss();
  }

  // on view start
  // if can get, update
  // otherwise, pop
}
