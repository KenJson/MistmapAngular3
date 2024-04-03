import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { PointsWithinRadiusPipe } from './pipes/points-within-radius.pipe';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), provideIonicAngular({}), PointsWithinRadiusPipe,
  importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "mistmap-angu", "appId": "1:1035644163878:web:b96e8f2b415ebcf01cd3e7", "storageBucket": "mistmap-angu.appspot.com", "apiKey": "AIzaSyBqHkgxgreoLEV3A_lk6NnSVpnHb82qKiY", "authDomain": "mistmap-angu.firebaseapp.com", "messagingSenderId": "1035644163878", "measurementId": "G-GGHJLRSPJ0" }))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage()))

  ]
};
