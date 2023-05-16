import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { PlacesService } from '../../services';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styles: [
    `
    .mapita{
      height: 100%;
      position: fixed;
      right: 0px;
      top: 0px;
      width: 100%;
    }
    `
  ]
})
export class MapViewComponent implements AfterViewInit{

  @ViewChild('mapita') mapa!: ElementRef

  constructor ( 
    private placesServices: PlacesService,
    private mapsServices: MapsService,
  ){

  }

  ngAfterViewInit(): void {

    if(!this.placesServices.userLocation){
      throw Error('No hay placesService.location')
    }

    const map = new Map({
      container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.placesServices.userLocation,
      zoom: 14,
    });
    
    const popup = new Popup()
    .setHTML(`
      <h6>Aqui estoy</h6>
      <span>Estoy en este lugar del mundo</span>
    `
    );

    new Marker({color: 'red'}).setLngLat(
      this.placesServices.userLocation,
    ).setPopup(popup).addTo(map)

    this.mapsServices.setMap(map);

  }



}
