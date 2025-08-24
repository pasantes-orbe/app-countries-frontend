//src/app/services/amenities/amenitie.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from '../helpers/alert.service';
import { CountryStorageService } from '../storage/country-storage.service';
import { AmenitieInterface } from '../../interfaces/amenitie-interface';
import { Observable } from 'rxjs';
import { OwnerStorageService } from '../storage/owner-interface-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AmenitieService {

  constructor(private _http: HttpClient, private _ownerStorageService: OwnerStorageService,private _alertService: AlertService, private _router: Router, private _countryStorageService: CountryStorageService) {
   }

   async addAmenitiy(name: string, address: string, avatar: File){

    const country = await this._countryStorageService.getCountry()
    const countryID = country.id;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('avatar', avatar);

    await this._alertService.setLoading();

    this._http.post(`${environment.URL}/api/amenities/${countryID}`, formData)
      .subscribe(async (res) => {
        console.log(res);
        await this._alertService.removeLoading();
        this._alertService.showAlert("¡Listo!", "El Lugar de Reserva se agregó con éxito");
        this._router.navigate([`/admin/ver-amenities`]);
      },
      async (err) => {
        console.log(err);
        console.log("ACA ENCONTRE EL ERROR ", err['error']);
        const keys = Object.keys(err)
        const dictionary = Object.entries(err)
        console.log("SUPUESTO MENSAJE DE ERROR",err );

        console.log("Estas son las keys ",keys);
        console.log("Estas son las llave valor", dictionary);

        console.log("este es el status", err['status']);
        await this._alertService.removeLoading();

        if(err['status'] == 0){
          await this._alertService.showAlert("Por favor subí una foto desde tu galería o archivos!", ``);
        } else {
          await this._alertService.showAlert("¡Ooops!", `${err['error']}`);
          this._router.navigate([`/admin/ver-amenities`]);
        }
        
    }
      );
   }


   public async getAll(): Promise<Observable<AmenitieInterface[]>> {
      const country = await this._countryStorageService.getCountry()
      const countryID = country.id
      return this._http.get<AmenitieInterface[]>(`${environment.URL}/api/amenities/${countryID}`);
   }


   public async getAllByOwner(): Promise<Observable<AmenitieInterface[]>> {
    const owner = await this._ownerStorageService.getOwner()

    if (owner) {
      var countryID = owner.property.id_country
    } else {
      var countryID = (await this._countryStorageService.getCountry()).id
    }

    return this._http.get<AmenitieInterface[]>(`${environment.URL}/api/amenities/${countryID}`);
 }
}
