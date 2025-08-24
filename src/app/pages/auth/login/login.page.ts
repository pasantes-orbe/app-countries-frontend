//src/app/pages/auth/login/login.page.ts
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
  }

  login() {
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