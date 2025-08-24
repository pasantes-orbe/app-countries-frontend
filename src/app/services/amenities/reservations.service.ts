//src/app/services/amenities/reservations.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AmenitieInterface } from 'src/app/interfaces/amenitie-interface';
import { ReservationsInterface } from 'src/app/interfaces/reservations-interface';
import { environment } from 'src/environments/environment';
import { AlertService } from '../helpers/alert.service';
import { CountryStorageService } from '../storage/country-storage.service';
import { OwnerStorageService } from '../storage/owner-interface-storage.service';
import { UserStorageService } from '../storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private _userStorageService: UserStorageService, private _countryStorageService: CountryStorageService, private _http: HttpClient, private _alertService: AlertService, private _router: Router, private _ownerStorageService: OwnerStorageService) {

   }

   public async createReservation(id_amenity, date, details, guests){

    const user = await this._userStorageService.getUser()
    const userID = user.id
    const formData = new FormData();
    formData.append('id_user', userID.toString());
    formData.append('id_amenity', id_amenity);
    formData.append('date', date);
    formData.append('details', details);

    await this._alertService.setLoading();

    this._http.post(`${environment.URL}/api/reservations`, formData).subscribe(async (res) => {
      console.log(res);
      console.log(res['id']);
      console.log("ESTO ES LO QUE SE ENVIA", guests);
      const id_reservation = res['id']


      console.log(guests);

      
      this._http.post(`${environment.URL}/api/invitation/${id_reservation}`,{

        guests: guests
      }).subscribe(async res =>{

        console.log(res);

        await this._alertService.removeLoading();
        this._alertService.showAlert("¡Listo!", "La reserva del lugar fue exitosa");
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;
        window.location.href = `${getUrl.protocol + "//" + getUrl.host}/home/tabs/tab3`
      }
      )

},
    async (err) => {
    console.log("asdfasdf", err['error']);
    await this._alertService.removeLoading();
    this._alertService.showAlert("¡Ooops!", `${err['error']}`);
  })

   }

   public async getAllByUser(): Promise<Observable<ReservationsInterface[]>> {
    const owner = await this._ownerStorageService.getOwner()
    const userID = owner.user.id

    return this._http.get<ReservationsInterface[]>(`${environment.URL}/api/reservations/get_by_user/${userID}`);
 }

  public async getAllByCountry():Promise<Observable<ReservationsInterface[]>>{
    const country = await this._countryStorageService.getCountry()
    const countryID = country.id
    return this._http.get<ReservationsInterface[]>(`${environment.URL}/api/reservations/country/get_by_id/${countryID}`)
  }

  public getAllByCountryAndStatus(id_country, status){

    return this._http.get<any[]>(`${environment.URL}/api/reservations/${id_country}?status=${status} `)
  }

  public updateStatus(status:boolean, reservationID: number){
    return this._http.patch(`${environment.URL}/api/reservations/${reservationID}/${status}`,{
    })
  }

  public reservationGuests(id_reservation){
    return this._http.get<any[]>(`${environment.URL}/api/invitation/${id_reservation}`)
  }

}
