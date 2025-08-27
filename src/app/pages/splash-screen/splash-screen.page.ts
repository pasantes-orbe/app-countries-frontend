import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RedirectService } from 'src/app/services/helpers/redirect.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { AuthStorageService } from 'src/app/services/storage/auth-storage.service';

// Importa los componentes de Ionic que usa el HTML
import { IonContent, IonSpinner, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonImg
  ]
})
export class SplashScreenPage implements OnInit {

  constructor(
    private router: Router,
    private _userStorage: UserStorageService,
    private _redirectService: RedirectService,
    private _authStorageService: AuthStorageService
  ) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  async ionViewWillEnter() {
    setTimeout(async () => {
      console.log('🔍 SPLASH: Iniciando verificación de usuario...');
      
      try {
        const user = await this._userStorage.getUser();
        const token = await this._authStorageService.getJWT();
        console.log('👤 SPLASH: Usuario obtenido del storage:', user);
        console.log('🔐 SPLASH: Token:', token ? 'existe' : 'no existe');
        
        // Validar que AMBOS existan y sean válidos
        if (user && user.role && user.role.name && token) {
          console.log('✅ SPLASH: Usuario válido encontrado, rol:', user.role.name);
          console.log('🚀 SPLASH: Redirigiendo por rol...');
          this._redirectService.redirectByRole(user.role.name);
        } else {
          console.log('❌ SPLASH: No hay usuario válido o token, redirigiendo a login');
          // Limpiar cualquier dato residual
          await this.clearAllStorage();
          await this.router.navigate(["/login"], { replaceUrl: true });
        }
        
      } catch (error) {
        console.error('💥 SPLASH: Error al obtener usuario:', error);
        await this.clearAllStorage();
        await this.router.navigate(["/login"], { replaceUrl: true });
      }
    }, 3000);
  }

  private async clearAllStorage() {
    try {
      console.log('🧹 SPLASH: Limpiando storage residual...');
      
      // Intentar limpiar el JWT
      try {
        await this._authStorageService.remove();
      } catch (e) {
        console.log('JWT storage ya estaba vacío o no existe método remove');
      }

      // Intentar limpiar el usuario
      try {
        await this._userStorage.removeUser();
      } catch (e) {
        console.log('User storage ya estaba vacío');
      }
      console.log('✅ SPLASH: Storage limpiado');
    } catch (error) {
      console.log('⚠️ SPLASH: Error limpiando storage:', error);
    }
  }
}
/*25-8import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RedirectService } from 'src/app/services/helpers/redirect.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { AuthStorageService } from 'src/app/services/storage/auth-storage.service';

// Importa los componentes de Ionic que usa el HTML
import { IonContent, IonSpinner, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonImg
  ]
})
export class SplashScreenPage implements OnInit {

  constructor(
    private router: Router,
    private _userStorage: UserStorageService,
    private _redirectService: RedirectService,
    private _authStorageService: AuthStorageService
  ) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  async ionViewWillEnter() {
    setTimeout(async () => {
      
      //const user = await this._userStorage.getUser();
      //if (user) {
       // this._redirectService.redirectByRole(user['role'].name)
      //} else {
      //  this.router.navigate(["/login"]);
       // }
      //}, 3000);
      console.log('🔍 SPLASH: Iniciando verificación de usuario...');
      try {
        const user = await this._userStorage.getUser();
        console.log('👤 SPLASH: Usuario obtenido del storage:', user);
        
        if(user && user.role && user.role.name) {
          console.log('✅ SPLASH: Usuario válido encontrado, rol:', user.role.name);
          console.log('🚀 SPLASH: Redirigiendo por rol...');
          this._redirectService.redirectByRole(user.role.name);
        } else {
          console.log('❌ SPLASH: No hay usuario válido, redirigiendo a login');
          this.router.navigate(["/login"]);
        }
      } catch (error) {
        console.error('💥 SPLASH: Error al obtener usuario:', error);
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }
}*/
