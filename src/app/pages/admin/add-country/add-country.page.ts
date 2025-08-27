import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/helpers/alert.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CountriesService } from 'src/app/services/countries/countries.service';

// Componentes
import { NavbarBackComponent } from "src/app/components/navbars/navbar-back/navbar-back.component";

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

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
export class AddCountryPage implements AfterViewInit, OnDestroy {
  private map: L.Map | null = null;
  public lat: number = -27.5615;
  public lng: number = -58.7521;
  public marker: L.Marker | null = null;
  public newImg: string = "https://ionicframework.com/docs/img/demos/card-media.png";
  
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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Crear mapa centrado en coordenadas por defecto
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: 8
    });

    // Agregar tiles
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);

    // Fix para el tamaño del mapa
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true);
      }
    }, 100);

    this.map.attributionControl.setPrefix(false);

    // Crear marcador arrastrable
    this.marker = L.marker([this.lat, this.lng], {
      draggable: true
    }).addTo(this.map);

    // Listener para cuando se arrastra el marcador
    this.marker.on('dragend', (event) => {
      const position = (event.target as L.Marker).getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
      console.log('Nueva posición:', this.lat, this.lng);
    });

    // Listener para clicks en el mapa
    this.map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      this.lat = lat;
      this.lng = lng;
      
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      }
    });
  }

  setCoords(): void {
    if (this.marker) {
      const { lat, lng } = this.marker.getLatLng();
      this.lat = lat;
      this.lng = lng;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.newImg = reader.result as string;
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