import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapboxComponent } from './components/mapbox/mapbox.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


import { environment } from '../environments/environment';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapboxComponent, HttpClientModule, CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MistmapAngular3';


  constructor() { }

  ngOnInit() {

  }

}