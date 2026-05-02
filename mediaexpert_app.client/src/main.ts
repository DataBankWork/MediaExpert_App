//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


//import { importProvidersFrom } from '@angular/core';
//import { AppComponent } from './app/app.component';
//import { AppRoutingModule } from './app/app-routing.module';
//import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
//import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


//bootstrapApplication(AppComponent, {
//    providers: [
//        importProvidersFrom(BrowserModule, AppRoutingModule),
//        provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()
//    ]
//})
//  .catch(err => console.error(err));
