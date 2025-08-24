import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CountriesService } from 'src/app/services/countries/countries.service';
import { CountryStorageService } from 'src/app/services/storage/country-storage.service';
import * as L from 'leaflet'; // PASO 1: Se comenta la importación de Leaflet.
import * as L from 'leaflet'; // PASO 1: Se comenta la importación de Leaflet.
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

//Interfaces
import { GuardPointInterface } from 'src/app/interfaces/guardsPoints-interface';

<<<<<<< Updated upstream
//Pipes
import { FilterByPipe } from '../../../pipes/filter-by.pipe';

//Componentes
=======
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
>>>>>>> Stashed changes
import { NavbarBackComponent } from 'src/app/components/navbars/navbar-back/navbar-back.component';


@Component({
  selector: 'app-map-guards',
  templateUrl: './map-guards.page.html',
  styleUrls: ['./map-guards.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    NavbarBackComponent
  ]
    IonicModule,
    NavbarBackComponent
  ]
})
export class MapGuardsPage implements OnInit {

  protected socket: Socket;
  protected countryLat: any;
  protected countryLng: any;
  protected tileLayer: any;
  protected map: any; // Se cambia a 'any' para evitar errores de tipo al desactivar Leaflet.
  public markers = [];
  protected activeGuards: GuardPointInterface[];
  protected id_country: any;

  constructor(private _countryService: CountriesService, private countryStorage: CountryStorageService) {
    this.socket = io(environment.URL);
  }

  async ngOnInit() {
    const country = await this.countryStorage.getCountry();
    const countryID = country.id;
    console.log(countryID);

    this.id_country = countryID;

    console.log(this.id_country);
    this.socket.on('get-actives-guards', (payload) => {
      this.removeMarkers();
      this.activeGuards = payload;
      this.activeGuards.forEach((data) => {
        if (data.id_country == this.id_country)
          this.addPoint(data.lat, data.lng, `Vigilador: <b>${data.user_name} - ${data.user_lastname}</b>`);
      });
    });

    this.socket.on('guardDisconnected', (payload) => {
      this.removeMarkers();
    });
  }

  async ngAfterViewInit() {
    const country = await this.countryStorage.getCountry();
    const countryID = country.id;

    this._countryService.getByID(countryID).subscribe(res => {
      console.log(res);
      this.countryLat = res['latitude'];
      this.countryLng = res['longitude'];
      // Se comenta la llamada a la inicialización del mapa.
      this.initMap(res['latitude'], res['longitude']); 
      this.initMap(res['latitude'], res['longitude']); 
    });
  }

  private initMap(mapLat, mapLng): void {
    // --- PASO 2: Se comenta todo el cuerpo de la función para desactivar la lógica del mapa. ---
    
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.setTileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    } else {
      this.setTileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    }

    this.map = L.map('map', {
      zoomControl: true,
      layers: [this.getTileLayer()],
    }).setView([mapLat, mapLng], 15);

    setTimeout(() => {
      this.getMap().invalidateSize(true);
    }, 100);
    
    
  }

  public addPoint(lat: number, lng: number, html: string = null): void {
    // Se comenta la lógica que crea el marcador en el mapa.
    
    
    const marker = L.circle([lat, lng], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 15
    })
      .bindPopup(html, { closeButton: false })
      .addTo(this.getMap());

    this.markers.push(marker);
    
    
  }

  public getMap() {
    return this.map;
  }
  public getTileLayer(): any {
    return this.tileLayer;
  }

  public removeMarkers() {
    // Se comenta la lógica para evitar errores si this.getMarkers() está vacío.
    
    
    this.getMarkers().forEach(marker => {
      this.removeMarker(marker);
    });
    
    
  }

  public removeMarker(marker) {
    this.map.removeLayer(marker);
    this.map.removeLayer(marker);
  }

  public getMarkers() {
    return this.markers;
  }

  public setTileLayer(url: any): void {
    this.tileLayer = L.tileLayer(url, { attribution: '' });
    this.tileLayer = L.tileLayer(url, { attribution: '' });
  }
}
