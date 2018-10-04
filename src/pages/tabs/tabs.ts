import { Component } from '@angular/core';

import { SamplePage } from '../sample/sample';
import { AnalysisPage } from '../analysis/analysis';
import { DataPage } from '../data/data';
import { UploadPage } from '../upload/upload';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SamplePage;
  tab2Root = DataPage;
  tab3Root = AnalysisPage;
  tab4Root = UploadPage;

  constructor() {

  }
}
