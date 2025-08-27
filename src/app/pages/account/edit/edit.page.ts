//pages/account/edit/adit.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//Servicios
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { UserService } from 'src/app/services/user/user.service';

// Componentes
import { NavbarBackComponent } from "src/app/components/navbars/navbar-back/navbar-back.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NavbarBackComponent
  ]
})
export class EditPage implements OnInit {

  public readonly: boolean = true; // Default readonly
  private formBuilder: FormBuilder;
  private form: FormGroup;
  public user: any;
  public name: string;
  public lastname: string;
  public phone: string;
  public email: string;
  public birthday: string;

  constructor(
    protected _formBuilder: FormBuilder, 
    protected _userService: UserService, 
    protected _userStorage: UserStorageService
  ) {
    this.formBuilder = _formBuilder;
    this.form = this.createForm();
  }

  async ngOnInit() {
    try {
      const user = await this._userStorage.getUser();
      
      if (!user) {
        console.error('❌ No se pudo obtener el usuario del storage');
        return;
      }
      
      this.user = user;
      console.log('👤 Usuario cargado:', user);
      
      // Llenar el formulario con los datos del usuario
      this.form.controls['name'].setValue(user.name || '');
      this.form.controls['lastname'].setValue(user.lastname || '');
      this.form.controls['phone'].setValue(user.phone || '');
      this.form.controls['birthday'].setValue(user.birthday || '');
      this.form.controls['email'].setValue(user.email || '');

      // ✅ LÓGICA CORREGIDA - Solo administradores y propietarios pueden editar
      if (user.role && user.role.name) {
        switch (user.role.name) {
          case 'administrador':
            this.readonly = false; // Administrador puede editar
            console.log('👨‍💼 Usuario administrador - Puede editar');
            break;
          case 'propietario':
            this.readonly = false; // ✅ CORREGIDO: Propietario puede editar
            console.log('🏠 Usuario propietario - Puede editar');
            break;
          case 'vigilador':
            this.readonly = true; // Vigilador no puede editar
            console.log('🛡️ Usuario vigilador - Solo lectura');
            break;
          default:
            this.readonly = true; // Por defecto, solo lectura
            console.log('❓ Rol desconocido - Solo lectura');
        }
      } else {
        console.error('❌ Usuario sin rol definido');
        this.readonly = true;
      }
      
      console.log('🔒 Readonly:', this.readonly);
      
    } catch (error) {
      console.error('❌ Error en ngOnInit:', error);
      this.readonly = true;
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthday: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  updateUser() {
    if (!this.form.valid) {
      console.error('❌ Formulario inválido');
      return;
    }

    if (this.readonly) {
      console.error('❌ Usuario sin permisos de edición');
      return;
    }

    console.log('🔄 Actualizando usuario...', {
      id: this.user.id,
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      birthday: this.form.get('birthday')?.value,
      email: this.form.get('email')?.value,
      phone: this.form.get('phone')?.value
    });

    // ✅ DESPUÉS DE CORREGIR EL UserService, este código funcionará
    this._userService.updateUser(
      this.user.id,
      this.form.get('name')?.value,
      this.form.get('lastname')?.value,
      this.form.get('birthday')?.value,
      this.form.get('email')?.value,
      this.form.get('phone')?.value
    ).subscribe({
      next: async (response) => {
        console.log('✅ Usuario actualizado correctamente:', response);
        
        // Actualizar el usuario en el storage local
        const updatedUser = { ...this.user };
        updatedUser.name = this.form.get('name')?.value;
        updatedUser.lastname = this.form.get('lastname')?.value;
        updatedUser.phone = this.form.get('phone')?.value;
        updatedUser.birthday = this.form.get('birthday')?.value;
        updatedUser.email = this.form.get('email')?.value;
        
        await this._userStorage.saveUser(updatedUser);
        this.user = updatedUser;
        
        this.form.markAsPristine();
        // Aquí podrías mostrar un toast de éxito
      },
      error: (error) => {
        console.error('❌ Error actualizando usuario:', error);
        // Aquí podrías mostrar un toast de error
      }
    });
  }

  getDate(event: any) {
    const { value } = event.detail;
    console.log('📅 Fecha seleccionada:', value);
    this.form.get('birthday')?.setValue(value);
  }

  public getForm(): FormGroup {
    return this.form;
  }
}


/*25-8 import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//Servicios
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { UserService } from 'src/app/services/user/user.service';

// Componentes
import { NavbarBackComponent } from "src/app/components/navbars/navbar-back/navbar-back.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NavbarBackComponent
  ]
})
export class EditPage implements OnInit {

  public readonly: boolean = true; // Default readonly
  private formBuilder: FormBuilder;
  private form: FormGroup;
  public user: any;
  public name: string;
  public lastname: string;
  public phone: string;
  public email: string;
  public birthday: string;

  constructor(
    protected _formBuilder: FormBuilder, 
    protected _userService: UserService, 
    protected _userStorage: UserStorageService
  ) {
    this.formBuilder = _formBuilder;
    this.form = this.createForm();
  }

  async ngOnInit() {
    try {
      const user = await this._userStorage.getUser();
      
      if (!user) {
        console.error('❌ No se pudo obtener el usuario del storage');
        return;
      }
      
      this.user = user;
      console.log('👤 Usuario cargado:', user);
      
      // Llenar el formulario con los datos del usuario
      this.form.controls['name'].setValue(user.name || '');
      this.form.controls['lastname'].setValue(user.lastname || '');
      this.form.controls['phone'].setValue(user.phone || '');
      this.form.controls['birthday'].setValue(user.birthday || '');
      this.form.controls['email'].setValue(user.email || '');

      // ✅ LÓGICA CORREGIDA - Solo administradores y propietarios pueden editar
      if (user.role && user.role.name) {
        switch (user.role.name) {
          case 'administrador':
            this.readonly = false; // Administrador puede editar
            console.log('👨‍💼 Usuario administrador - Puede editar');
            break;
          case 'propietario':
            this.readonly = false; // ✅ CORREGIDO: Propietario puede editar
            console.log('🏠 Usuario propietario - Puede editar');
            break;
          case 'vigilador':
            this.readonly = true; // Vigilador no puede editar
            console.log('🛡️ Usuario vigilador - Solo lectura');
            break;
          default:
            this.readonly = true; // Por defecto, solo lectura
            console.log('❓ Rol desconocido - Solo lectura');
        }
      } else {
        console.error('❌ Usuario sin rol definido');
        this.readonly = true;
      }
      
      console.log('🔒 Readonly:', this.readonly);
      
    } catch (error) {
      console.error('❌ Error en ngOnInit:', error);
      this.readonly = true;
    }
  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthday: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  updateUser() {
    if (!this.form.valid) {
      console.error('❌ Formulario inválido');
      return;
    }

    if (this.readonly) {
      console.error('❌ Usuario sin permisos de edición');
      return;
    }

    console.log('🔄 Actualizando usuario...', {
      id: this.user.id,
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      birthday: this.form.get('birthday')?.value,
      email: this.form.get('email')?.value,
      phone: this.form.get('phone')?.value
    });

    // ✅ CORREGIDO: El método updateUser retorna una Subscription, no un Observable
    // Por eso no se puede usar .subscribe() - ya está ejecutándose
    const subscription = this._userService.updateUser(
      this.user.id,
      this.form.get('name')?.value,
      this.form.get('lastname')?.value,
      this.form.get('birthday')?.value,
      this.form.get('email')?.value,
      this.form.get('phone')?.value
    );

    // Marcar el formulario como pristine después de la actualización
    this.form.markAsPristine();
    console.log('✅ Solicitud de actualización enviada');
    
    // Si necesitas manejar la respuesta, el UserService debe ser modificado
    // para retornar un Observable en lugar de una Subscription
  }

  getDate(event: any) {
    const { value } = event.detail;
    console.log('📅 Fecha seleccionada:', value);
    this.form.get('birthday')?.setValue(value);
  }

  public getForm(): FormGroup {
    return this.form;
  }
}*/


/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

//Servicios
import { UserStorageService } from 'src/app/services/storage/user-storage.service';
import { UserService } from 'src/app/services/user/user.service';

// Componentes
import { NavbarBackComponent } from "src/app/components/navbars/navbar-back/navbar-back.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    NavbarBackComponent
  ]
})
export class EditPage implements OnInit {

  public readonly: boolean;
  private formBuilder: FormBuilder;
  private form: FormGroup;
  public user;
  public name;
  public lastname;
  public phone;
  public email;
  public birthday;

  constructor(protected _formBuilder: FormBuilder, protected _userService: UserService, protected _userStorage: UserStorageService) {
    this.formBuilder = _formBuilder;
    this.form = this.createForm();

  }

  async ngOnInit() {

    const user = await this._userStorage.getUser()
    this.user = user
    this.form.controls['name'].setValue(user.name);
    this.form.controls['lastname'].setValue(user.lastname);
    this.form.controls['phone'].setValue(user.phone);
    this.form.controls['birthday'].setValue(user.birthday);
    this.form.controls['email'].setValue(user.email);

    if (this.user.role.name == 'administrador') {
      this.readonly = false
    } else {
      this.readonly = true
    }
    console.log(this.readonly);

  }
  ionViewWillEnter() {
    this.ngOnInit()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      lastname: [''],
      phone: [''],
      birthday: [''],
      email: ['']
    });
  }

  updateUser() {
    this._userService.updateUser(this.user.id,
      this.form.get('name').value,
      this.form.get('lastname').value,
      this.form.get('birthday').value,
      this.form.get('email').value,
      this.form.get('phone').value)

    this.form.markAsPristine()
  }
  getDate(event) {

    const { value } = event.detail;
    console.log(value);
  }

  public getForm(): FormGroup {
    return this.form;
  }
} */
