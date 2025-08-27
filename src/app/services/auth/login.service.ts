//app/services/auth/login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthStorageService } from '../storage/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private _authStorage: AuthStorageService
  ) { }

  public login(data) {

    console.log(data);
    console.log(data);

    
    return this.http.post(`${environment.URL}/api/auth/login`, data);

  }

  public async validJWT() {

    // Retornar true si es un JWT valido.

    // Obtener el JWT de storage
    const token = await this._authStorage.getJWT();

    // Validarlo con el backend
    const resp = await fetch(`${environment.URL}/api/auth/jwt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': token,
      }
    });

    return resp;
  }


  public async isRole(roleSearch: string){

    // Obtener el JWT de storage
    const token = await this._authStorage.getJWT();

    // Validarlo con el backend
    const resp = await fetch(`${environment.URL}/api/auth/jwt/${roleSearch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': token,
      }
    });

    if(resp.status == 200) return true;
    return false;
  }

}
