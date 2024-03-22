import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  imports: [IonicModule, HttpClientModule, CommonModule, RouterLink,],
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss'],
})
export class ProfilepageComponent implements OnInit {
  loaded = false;
  name: string;
  email: string;

  constructor(
    private router: Router,

  ) {
    this.name = '';
    this.email = '';
  }

  goToMap() {
    this.router.navigate(['/map']);
  }



  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 2000);
  }

}


