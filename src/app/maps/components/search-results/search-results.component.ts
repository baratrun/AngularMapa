import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { PlacesService } from '../../services';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styles: [
    `

    .pointer{
      cursor: pointer;
    }

    p{
      font-size: 12px;
    }
    `
  ]
})
export class SearchResultsComponent {

  public selectedId: string = '';

  constructor( 
    private placesServices: PlacesService,
    private mapService:MapsService ){
  }

  get isloadingPlaces(): boolean{
    return this.placesServices.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesServices.places;
  }

  flyto(place: Feature){

    this.selectedId = place.id;

    const [lng, lat] = place.center;
    const center: [number, number] = [lng,lat];
    this.mapService.flyTo(center);
  }

  verDireccion(place: Feature){

    if(!this.placesServices.userLocation){
      throw Error('NO hay ubicacion inicial')
    }

    if(! place ){
      return
    }

    this.placesServices.deletePlaces();

    const [lng, lat] = place.center;
    
    this.mapService.getRouteBetweenPoints(this.placesServices.userLocation!, [lng,lat] );
  }

}
