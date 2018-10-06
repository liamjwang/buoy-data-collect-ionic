import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GaugeModule } from 'angular-gauge';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SamplePage } from '../pages/sample/sample';
import { LiveviewPage } from '../pages/liveview/liveview';

import { PairingPage } from '../pages/pairing/pairing';
import { AnalysisPage } from '../pages/analysis/analysis';
import { DataPage } from '../pages/data/data';
import { UploadPage } from '../pages/upload/upload';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    SamplePage,
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
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SamplePage,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
