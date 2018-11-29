import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import {DataManagerProvider} from "../../providers/data-manager/data-manager";
import {NavParams} from "ionic-angular";


@Component({
  selector: 'page-edit-sample',
  templateUrl: 'edit-sample.html'
})
export class EditSamplePage {

  sampleID: number;
  datestring: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataManager: DataManagerProvider) {
    this.sampleID = this.navParams.get("sampleID");
    console.log("[Edit-Sample] Created with id: "+this.sampleID);
  }

  deleteSample() {
    this.dataManager.deleteSampleByID(this.sampleID).then(() => this.navCtrl.pop());
  }


}
