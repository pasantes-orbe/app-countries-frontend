import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleGuard } from '../interfaces/roleguard-interface';
import { LoginService } from '../services/auth/login.service';
import { AuthStorageService } from '../services/storage/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard  implements RoleGuard {

  public roleType: string = "vigilador";

  constructor(
    private _authStorage: AuthStorageService,
    private _loginService: LoginService,
    private _router: Router
  ){}

  /*canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
  console.log('🔒 SecurityGuard ejecutándose...');
  console.log('🔒 Retornando TRUE');/*
  
  // RETORNAR SIEMPRE TRUE:
  
    // COMENTAR TODA LA VALIDACIÓN TEMPORALMENTE:
    /*
    return this._loginService.isRole(this.roleType).then(
      validJWT => {

        if(!validJWT){
          this._router.navigate(['/login']);
          return false;
        }

        return true;        
      }
    );
    */
    
    // RETORNAR SIEMPRE TRUE PARA PERMITIR ACCESO:
    //return true;
  //}
}