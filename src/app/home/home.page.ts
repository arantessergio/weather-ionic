import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { v4 } from 'uuid';
import { CitiesService } from '../services/cities.service';
import { City } from '../models/City';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  citiesService = inject(CitiesService);
  router = inject(Router);
  toastController = inject(ToastController);

  cityList: Array<City> = [];
  cityListWithClimate: Array<City> = [];

  alertButtons = [
    {
      text: 'Confirmar',
      cssClass: 'alert-button',
      handler: (value?: any) => {
        this.addCity(value);
      },
    },
  ];
  alertInputs = [{ placeHolder: 'Digite o nome da cidade' }];

  constructor() {}

  ngOnInit() {
    this.cityList = this.citiesService.listCities();

    this.fetchClimatesForCities();
  }

  private fetchClimatesForCities() {
    if (this.cityList?.length) {
      this.citiesService
        .fetchClimateToManyCities(this.cityList)
        .subscribe((res: any) => {
          if (res?.bulk?.length) {
            this.cityListWithClimate = res?.bulk?.map((item: any) => ({
              id: item.query.custom_id,
              name: item.query.location?.name,
              cordinates: `${item.query.location?.lat},${item.query.location?.lon}`,
              climateData: {
                wind: item.query.current?.wind_kph,
                rain: item.query.current?.precip_mm,
                pressure: item.query.current?.pressure_mb,
                temperature: item.query.current?.temp_c,
                condition: item.query.current?.condition,
              },
            }));
          }
        });
    } else {
      this.cityListWithClimate = [];
    }
  }

  public addCity(value: any) {
    this.citiesService.searchCity(value['0']).subscribe(async (res: any) => {
      if (res?.length) {
        this.citiesService.addCity({
          id: v4(),
          name: res?.[0]?.name,
          cordinates: `${res?.[0].lat},${res?.[0].lon}`,
        });

        this.cityList = this.citiesService.listCities();
        this.fetchClimatesForCities();
      } else {
        const toast = await this.toastController.create({
          message: 'Cidade não localizada!',
          duration: 2000,
          position: 'bottom',
        });

        await toast.present();
      }
    });
  }

  public removeCity(city: City) {
    this.citiesService.removeCity(city.id);
    this.cityList = this.citiesService.listCities();
    this.fetchClimatesForCities();
  }

  public onLogoutClicked() {
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('cities');
    this.router.navigate(['/login']);
  }

  handleRefresh(event: any) {
    this.fetchClimatesForCities();
    event.target.complete();
  }
}
