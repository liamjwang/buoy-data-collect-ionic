import { Component } from '@angular/core';

import { PairingPage } from '../pairing/pairing';
import { DataPage } from '../data/data';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PairingPage;
  tab2Root = DataPage;

  constructor() {

  }
}
