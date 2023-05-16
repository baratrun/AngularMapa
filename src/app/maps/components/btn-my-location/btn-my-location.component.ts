import { Component } from '@angular/core';
import { PlacesService } from '../../services';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styles: [`
  
  button{
    position: fixed;
    right: 20px;
    top: 20px;
  }

  `
  ]
})
export class BtnMyLocationComponent {

  constructor( 
    private mapsService: MapsService,
    private placesService: PlacesService ){}

  goToMyLoc(){

    if(!this.placesService.userLocation){
      throw Error("No se encuentra la localizacion");
    }
    if(!this.mapsService.isMapReady){
      throw Error("No se encuentra el mapa");
    }

    this.mapsService.flyTo(this.placesService.userLocation!);
  }

}
