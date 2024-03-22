import { Routes } from '@angular/router';
import { MapboxComponent } from './components/mapbox/mapbox.component';
import { ProfilepageComponent } from './components/profilepage/profilepage.component';


export const routes: Routes = [
    { path: 'map', component: MapboxComponent },
    { path: 'profile', component: ProfilepageComponent },
    { path: '', redirectTo: '/map', pathMatch: 'full' }
];


export class AppRoutingModule { }
