import { Injectable } from '@angular/core';
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { map, retry } from 'rxjs';
import { DirectionClient } from '../api/directionsClient';
import { DirectionResponse, Route } from '../interfaces/direction';
import { Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private _map?: Map;
  private markers: Marker[] = []

  get isMapReady() {
    return !!this._map;
  }

  setMap(map: Map) {
    this._map = map;
  }

  flyTo(coords: [number, number]) {

    if (!this.isMapReady) throw Error('El mapa no esta listo');

    this._map?.flyTo({
      zoom: 14,
      center: coords
    })

  }

  constructor( private directionApi: DirectionClient ){}

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {

    if (!this._map) {
      throw Error('No existe el mapa');
    }

    this.markers.forEach(marker => { marker.remove() });
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(
        `
        <h6>${place.text_es}</h6>
        <span>${place.place_name_es}</span>
        `
      );
      const newMarker = new Marker().setLngLat([lng, lat]).setPopup(popup).addTo(this._map)

      newMarkers.push(newMarker);

    }

    this.markers = newMarkers;
    if(places.length == 0 ){ return }

    //Limites del mapa
    const bounds = new LngLatBounds()

    newMarkers.forEach(marker => {
      bounds.extend( marker.getLngLat() )
    })

    bounds.extend(userLocation);

    this._map.fitBounds(bounds, {
      padding: 200,
    })

  }


  getRouteBetweenPoints(start: [number, number], end: [number,number]){

    this.directionApi.get<DirectionResponse>(`/${start.join(',')};${end.join(',')}`)
    .subscribe(resp => {
      this.drawPolyline(resp.routes[0])
    });
    
  } 

  private drawPolyline(route: Route ) {
   
    if( !this._map ){
      throw Error('NO se encuentra el mapa');
    }

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();

    coords.forEach( ([lng, lat]) => {
      bounds.extend([lng,lat])
    } )


    console.log({
      kms: route.distance / 1000,
      duration: route.duration / 60,
    })

    this._map.fitBounds(bounds, {
      padding: 200,
    })

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords,
          }
        }
        ]
      }
    }

    //TODO: Limpiar ruta previa
    if(this._map.getLayer('LineaDeRuta')){
      this._map.removeLayer('LineaDeRuta');
      this._map.removeSource('LineaDeRuta');
    }


    this._map.addSource('LineaDeRuta', sourceData)
    this._map.addLayer({
      id: 'LineaDeRuta',
      type: 'line',
      source: 'LineaDeRuta',
      layout: {
        'line-cap': 'round',
        "line-join": 'round',

      },
      paint: {
        "line-color": 'black',
        'line-width': 3
      }
    })
  }



}
