import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapboxComponent } from './components/mapbox/mapbox.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MistmapAngular3';
}
