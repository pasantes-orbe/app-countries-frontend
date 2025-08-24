// --- Archivo: src/app/pages/admin/add-country/add-country.page.ts (Corregido) ---

import { AfterViewInit, Component } from '@angular/core';
import 'leaflet/dist/leaflet.css'; // PASO 1: Se comenta la importación de Leaflet.
import * as L from 'leaflet'; // PASO 2: Se comenta la importación de Leaflet.
import 'leaflet-defaulticon-compatibility'; // PASO 3: Se comenta la importación de Leaflet.
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/helpers/alert.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CountriesService } from 'src/app/services/countries/countries.service';

//Componentes
import { NavbarBackComponent } from "src/app/components/navbars/navbar-back/navbar-back.component";
@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.page.html',
  styleUrls: ['./add-country.page.scss'],
  standalone: true,
 imports: [
  CommonModule,
  IonicModule,
  ReactiveFormsModule,
  NavbarBackComponent
]
})
export class AddCountryPage implements AfterViewInit {

  private map: any;
  public lat: number;
  public lng: number;
  public marker: any;
  public newImg: any = "https://ionicframework.com/docs/img/demos/card-media.png";
  
  // CORRECCIÓN: La propiedad 'form' ahora es pública para que el HTML pueda acceder a ella.
  public form: FormGroup;

  constructor(
    private _countries: CountriesService,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private http: HttpClient,
    private _router: Router
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this._formBuilder.group({
      countryName: ['', [Validators.required, Validators.minLength(3)]],
      countryAvatar: new FormControl(null, [Validators.required]),
      fileSource: new FormControl(null, [Validators.required])
    });
  }

  ngAfterViewInit(): void {
    
    this.initMap();
  }

  private initMap(): void {
    
    
    this.map = L.map('map', {
      center: [-27.5615, -58.7521],
      zoom: 8
    });

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 100);

    this.map.attributionControl.setPrefix(false);

    const iconRetinaUrl = 'assets/marker-guard.webp';
    const iconUrl = 'assets/marker-guard.webp';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      iconSize: [35, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([-27.5615, -58.7521], {
      draggable: true
    });

    L.Marker.prototype.options.icon = iconDefault;
    this.map.addLayer(this.marker);

    this.marker.addEventListener('dragend', (event) => {
      let position = event.target.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
    });
    
  }

  setCoords() {
    if (this.marker) {
      const { lat, lng } = this.marker.getLatLng();
      this.lat = lat;
      this.lng = lng;
    } else {
      // Se asignan coordenadas por defecto si el mapa está desactivado.
      this.lat = -27.5615;
      this.lng = -58.7521;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.newImg = reader.result;
      reader.readAsDataURL(file);

      this.form.patchValue({
        fileSource: file
      });
    }
  }

  public addCountry(): void {
    if (this.form.invalid) {
      this._alertService.presentAlert('Formulario Inválido: Por favor, complete todos los campos.');
      return;
    }

    this.setCoords();
    
    // Se asume que el servicio devuelve una Promise.
    this._countries.addCountry(
      this.form.value.fileSource,
      this.form.value.countryName,
      String(this.lat),
      String(this.lng)
    )
      .then(() => {
        this._alertService.presentAlert('Éxito: El país ha sido agregado correctamente.');
        this._router.navigate(['/admin/home']);
      })
      .catch(err => {
        console.error("Error al agregar el país:", err);
        this._alertService.presentAlert('Error: No se pudo agregar el país.');
      });
  }
}