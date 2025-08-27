/*24-8import { Injectable } from '@angular/core';
i-mport { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private _router: Router
  ) { }

  public redirectByRole(role: string){

    var getUrl = window.location;
    var baseUrl = getUrl .protocol + "//" + getUrl.host;
    
    //TODO: VER SI FUNCIONA BIEN EN EL APK
    window.location.href = `${getUrl .protocol + "//" + getUrl.host}/menu/home`;


    if(role == "propietario") window.location.href = `${getUrl .protocol + "//" + getUrl.host}/home`;
    if(role == "vigilador") window.location.href = `${getUrl .protocol + "//" + getUrl.host}/vigiladores/home`; 
    if(role == "administrador") window.location.href = `${getUrl .protocol + "//" + getUrl.host}/admin/home`;
  }
}*/
//app/services/helpers/redirect.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private _router: Router
  ) { }

  public redirectByRole(role: string) {
    console.log('🚀 RedirectService: Redirigiendo por rol:', role);

    // Usar Angular Router en lugar de window.location.href
    // para evitar recargas completas de página

    switch (role) {
      case 'propietario':
      case 'usuario':
        console.log('🏠 RedirectService: Redirigiendo a /home');
        this._router.navigate(['/home']);
        break;

      case 'vigilador':
        console.log('🛡️ RedirectService: Redirigiendo a /guards/home');
        this._router.navigate(['/guards/home']);
        break;

      case 'administrador':
        console.log('👨‍💼 RedirectService: Redirigiendo a /admin/home');
        this._router.navigate(['/admin/home']);
        break;

      default:
        console.log('📋 RedirectService: Rol no reconocido, redirigiendo a /home');
        this._router.navigate(['/home']);
        break;
    }
  }
}