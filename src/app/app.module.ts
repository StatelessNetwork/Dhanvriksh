import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyPageModule } from './verify/verify.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { StorageService } from './services/storage.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LanguageService } from './services/language.service';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { File } from '@ionic-native/file/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { DatePipe } from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translations/');
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,FormsModule,ReactiveFormsModule,VerifyPageModule,TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot({
      name:'testdb',
      driverOrder:[Drivers.IndexedDB]
    })],
  providers: [{provide:APP_INITIALIZER, useFactory:appConfigServiceFactory,deps:[LanguageService],multi:true},
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },OpenNativeSettings,StorageService,LanguageService,TranslatePipe,
            { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,multi: true},PDFGenerator,File,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function appConfigServiceFactory(lang:LanguageService){
  return ()=>lang.getResourceData();  
}
