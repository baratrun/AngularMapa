import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styles: [
    `
    .search-container{
      background-color: #fff9;
      border-radius: 10px;
      box-shadow: 0px 10px 10px rgb(0,0,0,0.2);
      left:20px;
      padding: 5px;
      position: fixed;
      top: 20px;
      width: 270px;
    }
    `
  ]
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;

  constructor( private placesServices: PlacesService){}

  onQueryChanges(value: string){

    if(this.debounceTimer) {
      clearTimeout( this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.placesServices.getPlacesByQuery(value);
    },350)



  }

}
