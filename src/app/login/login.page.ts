import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CitiesService } from '../services/cities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private citiesService = inject(CitiesService);

  email?: string;
  password?: string;

  constructor() {}

  ngOnInit() {}

  async onLoginClicked() {
    if (this.email && this.password) {
      this.router.navigate(['/home']);
      window.localStorage.setItem('auth', JSON.stringify(true));
      this.citiesService.fillInitialData();
    } else {
      const toast = await this.toastCtrl.create({
        message:
          'Por favor informe um email e senha!',
          duration: 2000
      });

      toast.present();
    }
  }
}
