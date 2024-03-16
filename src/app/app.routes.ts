import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapboxComponent } from './components/mapbox/mapbox.component';

export const routes: Routes = [{ path: 'map', component: MapboxComponent },];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
