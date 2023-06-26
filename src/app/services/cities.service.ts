import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { City } from '../models/City';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

const BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = '1bda4888d4f14e31b2b210129232306';
const CITIES_KEY = 'cities';

@Injectable({
  providedIn: 'root',
})
export class CitiesService {
  private http = inject(HttpClient);

  constructor() {}

  getLocalStorageCities() {
    return window.localStorage.getItem(CITIES_KEY);
  }

  fillInitialData() {
    const cities = this.getLocalStorageCities();
    if (!cities || (cities && !JSON.parse(cities).length)) {
      window.localStorage.setItem(
        CITIES_KEY,
        JSON.stringify([
          { id: v4(), name: 'Curitiba', cordinates: '-25.4244,-49.2653' },
          { id: v4(), name: 'Alphaville', cordinates: '-23.4769 ,-46.8662' },
          { id: v4(), name: 'Sorocaba', cordinates: '-23.5015,-47.4526' },
          { id: v4(), name: 'Amsterdã', cordinates: '52.3702,4.8952' },
        ])
      );
    }
  }

  addCity(newCity: City) {
    const cities = this.getLocalStorageCities();
    if (cities) {
      const parsedArray = JSON.parse(cities);
      window.localStorage.setItem(
        CITIES_KEY,
        JSON.stringify([...parsedArray, newCity])
      );
    }
  }

  listCities(): Array<City> {
    const cities = this.getLocalStorageCities();
    if (cities) {
      return JSON.parse(cities);
    }
    return [];
  }

  removeCity(cityToRemove?: string) {
    const cities = this.getLocalStorageCities();
    if (cities) {
      const parsed = JSON.parse(cities);

      window.localStorage.setItem(
        CITIES_KEY,
        JSON.stringify(parsed.filter((item: City) => item.id !== cityToRemove))
      );
    }
  }

  fetchClimate(cordinates?: string): Observable<any> {
    return this.http.get(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${cordinates}`
    );
  }

  fetchClimateToManyCities(arr: Array<City>) {
    return this.http.post(`${BASE_URL}/current.json?key=${API_KEY}&q=bulk`, {
      locations: arr?.map((item) => ({
        q: item.cordinates,
        custom_id: item.id,
      })),
    });
  }

  searchCity(search?: string) {
    return this.http.get(`${BASE_URL}/search.json?key=${API_KEY}&q=${search}`);
  }
}
