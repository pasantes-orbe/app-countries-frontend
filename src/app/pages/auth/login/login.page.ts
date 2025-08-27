//pages/auth/login/login.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

// Componentes Standalone de Ionic
import {
  IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, IonText, IonCard, IonCardHeader, IonAvatar, IonCardContent
} from '@ionic/angular/standalone';

// Íconos
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

// Servicios y otros
import { PasswordRecoverPage } from 'src/app/modals/auth/password-recover/password-recover.page';
import { LoginService } from 'src/app/services/auth/login.service';
import { GuardsService } from 'src/app/services/guards/guards.service';
import { LoadingService } from 'src/app/services/helpers/loading.service';
import { RedirectService } from 'src/app/services/helpers/redirect.service';
import { AuthStorageService } from 'src/app/services/storage/auth-storage.service';
import { CountryStorageService } from 'src/app/services/storage/country-storage.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { WebSocketService } from 'src/app/services/websocket/web-socket.service';
import { Storage } from '@ionic/storage-angular';
import { PushService } from 'src/app/services/pushNotifications/push.service';
import { Capacitor } from '@capacitor/core';

import { LoaderComponent } from '../../../components/loader/loader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonCard,
    IonCardHeader,
    IonAvatar,
    IonCardContent
  ]
})
export class LoginPage implements OnInit {

  @ViewChild('passwordShowIcon') passIcon;

  private formBuilder: FormBuilder;
  private form: FormGroup;
  private errorMessage: any;

  constructor(
    private _router: Router,
    private storage: Storage,
    private _modalCtrl: ModalController,
    protected _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _guardsService: GuardsService,
    private _authStorage: AuthStorageService,
    protected _loading: LoadingService,
    private _userStorage: UserStorageService,
    private _countryStorageService: CountryStorageService,
    private _redirectService: RedirectService,
    private _webSocketService: WebSocketService,
    private _pushService: PushService
  ) {
    this.formBuilder = _formBuilder;
    this.form = this.createForm();
    addIcons({ eyeOutline, eyeOffOutline });
  }

  async ngOnInit() {
    this._webSocketService.conectar();
  }

  // ✅ MÉTODO CORREGIDO - Manejo defensivo del usuario
  private async ionViewWillEnter() {
    this.setErrorMessage(false);
    
    try {
      const user = await this._userStorage.getUser();
      console.log('🔍 ionViewWillEnter - Usuario obtenido:', user);
      
      // 🛡️ VERIFICACIÓN DEFENSIVA COMPLETA
      if (user && user.role && user.role.name) {
        console.log('✅ Usuario válido encontrado, redirigiendo...');
        this._redirectService.redirectByRole(user.role.name);
      } else if (user) {
        console.warn('⚠️ Usuario existe pero datos inválidos:', user);
        // Limpiar usuario corrupto
        await this._userStorage.removeUser();
      } else {
        console.log('ℹ️ No hay usuario en storage');
      }
    } catch (error) {
      console.error('❌ Error en ionViewWillEnter:', error);
      // Limpiar storage en caso de error
      await this._userStorage.removeUser();
      await this._authStorage.remove();
    }
  }
// ✅ MÉTODO LOGIN CORREGIDO - Manejo completo de roles
login() {
  if (!this.getForm().valid) return;
  
  this._loading.startLoading("Aguarde un momento...");
  this.setErrorMessage(false);
  
  const user = {
    email: this.getForm().get('user').value,
    password: this.getForm().get('password').value
  }
  
  console.log('🔐 LOGIN: Enviando credenciales:', { email: user.email });
  
  this._loginService.login(user).subscribe({
    next: async (data: any) => {
      try {
        console.log('✅ LOGIN: Respuesta exitosa del servidor:', data);
        
        // 🔍 VALIDACIÓN DE DATOS RECIBIDOS
        if (!data || !data.token || !data.user) {
          throw new Error('Respuesta del servidor inválida');
        }
        
        if (!data.user.role || !data.user.role.name) {
          throw new Error('Usuario sin rol asignado');
        }
        
        // Guardar token
        console.log('💾 LOGIN: Guardando token...');
        await this._authStorage.saveJWT(data['token']);
        
        // Guardar usuario
        console.log('👤 LOGIN: Guardando usuario:', data['user']);
        await this._userStorage.saveUser(data['user']);
        
        const { name } = data['user'].role;
        console.log('👨‍💼 LOGIN: Rol del usuario:', name);
        
        // Configurar push notifications si es Android
        if (Capacitor.getPlatform() === 'android') {
          this._pushService.setOneSignalID(data['user']['id']);
        }
        
        // ✅ MANEJO COMPLETO DE TODOS LOS ROLES
        switch (name) {
          case "vigilador":
            console.log('🛡️ LOGIN: Usuario es vigilador, obteniendo datos adicionales...');
            this._guardsService.getGuardByCountryId(data['user']['id']).subscribe({
              next: async (guardData: any) => {
                try {
                  await this._countryStorageService.saveCountry(guardData['country']);
                  console.log('🚀 LOGIN: Redirigiendo vigilador...');
                  this._redirectService.redirectByRole(name);
                  this.setErrorMessage("Iniciando sesión...");
                } catch (error) {
                  console.error('❌ Error guardando país del vigilador:', error);
                  this.setErrorMessage("Error al guardar datos del vigilador");
                } finally {
                  this._loading.stopLoading();
                }
              },
              error: (guardError) => {
                console.error('❌ Error obteniendo datos del vigilador:', guardError);
                this.setErrorMessage("Error al cargar datos del vigilador");
                this._loading.stopLoading();
              }
            });
            break;
            
          case "administrador":
            console.log('👨‍💼 LOGIN: Usuario es administrador, redirigiendo...');
            this._redirectService.redirectByRole(name);
            this._loading.stopLoading();
            break;
            
          case "propietario":
            console.log('🏠 LOGIN: Usuario es propietario, redirigiendo...');
            this._redirectService.redirectByRole(name);
            this._loading.stopLoading();
            break;
            
          default:
            console.warn('⚠️ LOGIN: Rol no reconocido:', name);
            console.log('🚀 LOGIN: Intentando redirección con rol desconocido...');
            this._redirectService.redirectByRole(name);
            this._loading.stopLoading();
            break;
        }
        
      } catch (error) {
        console.error('❌ Error procesando respuesta de login:', error);
        this.setErrorMessage('Error procesando datos del usuario');
        this._loading.stopLoading();
      }
    },
    error: (fail: any) => {
      console.error("💥 LOGIN ERROR:", fail);
      const { status } = fail;
      
      if (status == 0) {
        this.setErrorMessage("Error de conexión con el servidor");
      } else {
        this.setErrorMessage(fail.error?.msg || "Error en el inicio de sesión");
      }
      this._loading.stopLoading();
    }
  });
}


  private createForm(): FormGroup {
    return this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public getForm(): FormGroup {
    return this.form;
  }

  async openModal() {
    const modal = await this._modalCtrl.create({
      component: PasswordRecoverPage,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data, role);
  }

  protected showPassword(input): void {
    (this.getPasswordType(input) === "password")
      ? this.setPasswordType(input, "text")
      : this.setPasswordType(input, "password");
    this.changeIcon(input);
  }

  private changeIcon(input): void {
    (this.getPasswordType(input) === "password")
      ? this.passIcon.name = "eye-outline"
      : this.passIcon.name = "eye-off-outline"
  }

  private getPasswordType(input): string {
    return input.type;
  }

  private setPasswordType(input, type): void {
    input.type = type;
  }

  public getErrorMessage(): any {
    return this.errorMessage;
  }

  public setErrorMessage(errorMessage: any): void {
    this.errorMessage = errorMessage;
  }
}

/*25-8import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

// Componentes Standalone de Ionic
import {
  IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSpinner, IonText, IonCard, IonCardHeader, IonAvatar, IonCardContent
} from '@ionic/angular/standalone';

// Íconos
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

// Servicios y otros
import { PasswordRecoverPage } from 'src/app/modals/auth/password-recover/password-recover.page';
import { LoginService } from 'src/app/services/auth/login.service';
import { GuardsService } from 'src/app/services/guards/guards.service';
import { LoadingService } from 'src/app/services/helpers/loading.service';
import { RedirectService } from 'src/app/services/helpers/redirect.service';
import { AuthStorageService } from 'src/app/services/storage/auth-storage.service';
import { CountryStorageService } from 'src/app/services/storage/country-storage.service';
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { WebSocketService } from 'src/app/services/websocket/web-socket.service';
// ¡¡¡CORRECCIÓN CRÍTICA ACA!!!
// Se debe importar Storage desde '@ionic/storage-angular', no desde '@ionic/storage'.
import { Storage } from '@ionic/storage-angular';
import { PushService } from 'src/app/services/pushNotifications/push.service';
import { Capacitor } from '@capacitor/core';

import { LoaderComponent } from '../../../components/loader/loader.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonCard,
    IonCardHeader,
    IonAvatar,
    IonCardContent
  ]
})
export class LoginPage implements OnInit {

  @ViewChild('passwordShowIcon') passIcon;

  private formBuilder: FormBuilder;
  private form: FormGroup;
  private errorMessage: any;

  constructor(
    private _router: Router,
    // La inyección ahora funcionará porque el tipo importado es el correcto.
    private storage: Storage,
    private _modalCtrl: ModalController,
    protected _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _guardsService: GuardsService,
    private _authStorage: AuthStorageService,
    protected _loading: LoadingService,
    private _userStorage: UserStorageService,
    private _countryStorageService: CountryStorageService,
    private _redirectService: RedirectService,
    private _webSocketService: WebSocketService,
    private _pushService: PushService
  ) {
    this.formBuilder = _formBuilder;
    this.form = this.createForm();
    addIcons({ eyeOutline, eyeOffOutline });
  }

  async ngOnInit() {
    this._webSocketService.conectar();
  }

  private async ionViewWillEnter() {
    this.setErrorMessage(false);
    const user = await this._userStorage.getUser();
    if (user) this._redirectService.redirectByRole(user['role'].name);
  }25-8*/

  /*login() {
    if (!this.getForm().valid) return;
    this._loading.startLoading("Aguarde un momento...");
    this.setErrorMessage(false);
    const user = {
      email: this.getForm().get('user').value,
      password: this.getForm().get('password').value
    }
    this._loginService.login(user).subscribe(
      data => {
        this._authStorage.saveJWT(data['token']);
        this._userStorage.saveUser(data['user']);
        const { name } = data['user'].role;
        if (Capacitor.getPlatform() === 'android') {
          this._pushService.setOneSignalID(data['user']['id'])
        }
        if (name == "vigilador") {
          this._guardsService.getGuardByCountryId(data['user']['id']).subscribe(async data => {
            await this._countryStorageService.saveCountry(data['country'])
            this._redirectService.redirectByRole(name);
            this.setErrorMessage("Iniciando sesion...");
            this._loading.stopLoading();
          })
        } else {
          this._redirectService.redirectByRole(name);
        }
      },
      fail => {
        console.log("ERR", fail);
        const { status } = fail;
        if (status == 0) {
          return this.setErrorMessage("Error de conexión con el servidor");
        }
        this.setErrorMessage(fail.error.msg);
        this._loading.stopLoading();
      }
    );
  }*/
  /*25-8 login() {
    if (!this.getForm().valid) return;
    this._loading.startLoading("Aguarde un momento...");
    this.setErrorMessage(false);
    const user = {
      email: this.getForm().get('user').value,
      password: this.getForm().get('password').value
    }
    
    console.log('🔐 LOGIN: Enviando credenciales:', user);
    
    this._loginService.login(user).subscribe(
      data => {
        console.log('✅ LOGIN: Respuesta exitosa del servidor:', data);
        
        // Guardar token
        console.log('💾 LOGIN: Guardando token:', data['token']);
        this._authStorage.saveJWT(data['token']);
        
        // Guardar usuario
        console.log('👤 LOGIN: Guardando usuario:', data['user']);
        this._userStorage.saveUser(data['user']);
        
        const { name } = data['user'].role;
        console.log('👨‍💼 LOGIN: Rol del usuario:', name);
        
        if (Capacitor.getPlatform() === 'android') {
          this._pushService.setOneSignalID(data['user']['id'])
        }
        
        if (name == "vigilador") {
          console.log('🛡️ LOGIN: Usuario es vigilador, obteniendo datos adicionales...');
          this._guardsService.getGuardByCountryId(data['user']['id']).subscribe(async data => {
            await this._countryStorageService.saveCountry(data['country'])
            console.log('🚀 LOGIN: Redirigiendo vigilador...');
            this._redirectService.redirectByRole(name);
            this.setErrorMessage("Iniciando sesion...");
            this._loading.stopLoading();
          })
        } else {
          console.log('🚀 LOGIN: Redirigiendo usuario normal...');
          this._redirectService.redirectByRole(name);
        }
      },
      fail => {
        console.log("💥 LOGIN ERROR:", fail);
        const { status } = fail;
        if (status == 0) {
          return this.setErrorMessage("Error de conexión con el servidor");
        }
        this.setErrorMessage(fail.error.msg);
        this._loading.stopLoading();
      }
    );
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  public getForm(): FormGroup {
    return this.form;
  }

  async openModal() {
    const modal = await this._modalCtrl.create({
      component: PasswordRecoverPage,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data, role);
  }

  protected showPassword(input): void {
    (this.getPasswordType(input) === "password")
      ? this.setPasswordType(input, "text")
      : this.setPasswordType(input, "password");
    this.changeIcon(input);
  }

  private changeIcon(input): void {
    (this.getPasswordType(input) === "password")
      ? this.passIcon.name = "eye-outline"
      : this.passIcon.name = "eye-off-outline"
  }

  private getPasswordType(input): string {
    return input.type;
  }

  private setPasswordType(input, type): void {
    input.type = type;
  }

  public getErrorMessage(): any {
    return this.errorMessage;
  }

  public setErrorMessage(errorMessage: any): void {
    this.errorMessage = errorMessage;
  }
}*/