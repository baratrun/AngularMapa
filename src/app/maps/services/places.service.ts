import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api/placesApiClient';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapsService } from './maps.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapServices: MapsService) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise((result, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          result(this.userLocation);
        },
        (err) => {
          console.log(err);
          alert(err);
          reject();
        }
      );

    })
  }

  getPlacesByQuery(query: string = '') {

    if(!(query.length > 0)){
      this.places = [];
      this.isLoadingPlaces = false;
      return
    }

    if(!this.userLocation){
      throw Error('No hay user location');
    }

    this.isLoadingPlaces = true;
    this.places = [];

    this.placesApi.get<PlacesResponse>(`/${query}.json`,{
      params: {
        proximity: this.userLocation!.join(',')
      }
    })
      .subscribe(resp => {

        console.log(resp.features)
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapServices.createMarkersFromPlaces(this.places, this.userLocation!)

      })

  }

  deletePlaces(){
    this.places = [];
  }

}
