import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';


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
  imageUrl: string | undefined;

  constructor(
    private router: Router,

  ) {
    this.name = '';
    this.email = '';
    this.imageUrl = '';
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    this.imageUrl = image.webPath;
  }

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 2000);
  }

}


