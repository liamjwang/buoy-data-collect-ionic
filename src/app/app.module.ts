import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GaugeModule } from 'angular-gauge';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BLE } from '@ionic-native/ble';
import { SQLite } from '@ionic-native/sqlite';

import { SamplePage } from '../pages/sample/sample';
import { EditSamplePage } from '../pages/edit-sample/edit-sample';
import { LiveviewPage } from '../pages/liveview/liveview';

import { PairingPage } from '../pages/pairing/pairing';
import { AnalysisPage } from '../pages/analysis/analysis';
import { DataPage } from '../pages/data/data';
import { UploadPage } from '../pages/upload/upload';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataManagerProvider } from '../providers/data-manager/data-manager';
import { WaterwandBleApiProvider } from '../providers/waterwand-ble-api/waterwand-ble-api';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';

@NgModule({
  declarations: [
    MyApp,
    SamplePage,
    EditSamplePage,
    LiveviewPage,
    AnalysisPage,
    DataPage,
    UploadPage,
    PairingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    GaugeModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SamplePage,
    EditSamplePage,
    LiveviewPage,
    AnalysisPage,
    DataPage,
    UploadPage,
    PairingPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataManagerProvider,
    WaterwandBleApiProvider
  ]
})
export class AppModule {}
