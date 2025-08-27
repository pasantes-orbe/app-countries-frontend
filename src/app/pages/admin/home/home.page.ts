import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AlertController, PopoverController } from '@ionic/angular';

// Servicios
import { CountriesService } from 'src/app/services/countries/countries.service';
import { CountryStorageService } from 'src/app/services/storage/country-storage.service';

// Interfaces
import { CountryInteface } from '../../../interfaces/country-interface';

// Componentes
import { NavbarAdminComponent } from 'src/app/components/navbars/navbar-admin/navbar-admin.component';
import { CountryPopoverComponent } from 'src/app/components/country-popover/country-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    // Componentes
    NavbarAdminComponent,
    CountryPopoverComponent
  ]
})
export class HomePage implements OnInit {
  protected countries: CountryInteface[] = [];

  constructor(
    private countriesService: CountriesService,
    private countryStorage: CountryStorageService,
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCountriesFromDB();
  }

  ionViewWillEnter() {
    this.getCountriesFromDB();
  }

  // ====================================================
  // MÉTODOS DE NAVEGACIÓN
  // ====================================================
  
  // MÉTODOS DE NAVEGACIÓN CORRECTOS:

navigateToCountries() {
  // Ya estás en admin/home que lista countries
  // Puedes ir al dashboard del country o crear uno nuevo
  this.router.navigate(['/admin/country-dashboard']);
}

navigateToOwners() {
  // Ir a la vista de propietarios
  this.router.navigate(['/admin/view-owners']);
}

navigateToGuards() {
  // Ir a la vista de todos los guardias
  this.router.navigate(['/admin/all-guards']);
}

navigateToReports() {
  // Ir al historial de eventos (reportes)
  this.router.navigate(['/admin/events-historial']);
}

navigateToAddCountry() {
  // Ir a la vista para agregar un nuevo país
  this.router.navigate(['/admin/add-country']);
}

navigateToAddOwner() {
  // Ir a la vista para agregar un nuevo propietario
  this.router.navigate(['/admin/add-country-owner']);
}

navigateToAssignCountryToOwner() {
  // Ir a la vista para asignar un país a un propietario
  this.router.navigate(['/admin/assign-country-to-owner']);
}

navigateToAddAmenity() {
  // Ir a la vista para agregar una nueva amenidad
  this.router.navigate(['/admin/add-amenity']);
}

navigateToViewAllAmenities() {
  // Ir a la vista para ver todas las amenidades
  this.router.navigate(['/admin/view-all-amenities']);
}

navigateToMapGuards() {
  // Ir a la vista del mapa con todos los guardias
  this.router.navigate(['/map-guards']);
}

navigateToAddProperty() {
  // Ir a la vista para agregar una nueva propiedad
  this.router.navigate(['/admin/add-property']);
}

  // ====================================================
  // MÉTODOS EXISTENTES
  // ====================================================

  private getCountriesFromDB() {
    this.countriesService.getAll().subscribe({
      next: (data) => {
        this.countries = (data as CountryInteface[]).filter(country => {
          return country.isActive !== false;
        });
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  saveCountryLocalStorage(country: CountryInteface) {
    this.countryStorage.saveCountry(country);
  }

  async openPopover(country: CountryInteface, ev: any) {
    const popover = await this.popoverController.create({
      component: CountryPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        country: country
      }
    });

    popover.onDidDismiss().then((data) => {
      if (data?.data?.deleted) {
        this.getCountriesFromDB();
      }
    });

    return await popover.present();
  }

  private async handleError(error: any) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'No se pudieron cargar los países. Por favor, intente nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
    console.error('Error al cargar países:', error);
  }

  getCountryImage(country: CountryInteface): string {
    return country.avatar || country.image || 'https://ionicframework.com/docs/img/demos/card-media.png';
  }
}