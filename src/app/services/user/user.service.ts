//app/services/user/user.service.ts
// user.service.ts - Corrección basada en tu código actual

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { environment } from 'src/environments/environment';
import { UserStorageService } from '../storage/user-storage.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _htpp: HttpClient,
    private _userStorage: UserStorageService,
    private toastController: ToastController
  ) { }

  getUserByID(id: any) {
    return this._htpp.get<any>(`${environment.URL}/api/users/${id}`);
  }

  // ✅ MÉTODO CORREGIDO - Ahora retorna Observable
  updateUser(id: any, name: string, lastname: string, birthday: string, email: string, phone: string): Observable<any> {
    console.log('🔄 UserService.updateUser:', { birthday, name, lastname, email, phone });
    
    return this._htpp.patch<UserInterface>(`${environment.URL}/api/users/update-user/${id}`, {
      name,
      birthday,
      lastname,
      email,
      phone
    });
  }

  // ✅ MÉTODO PARA USO INTERNO - Con manejo automático de toast y storage
  updateMyUser(id: any, name: string, lastname: string, birthday: string, email: string, phone: string) {
    console.log('🔄 UserService.updateMyUser:', { birthday, name, lastname, email, phone });
    
    return this._htpp.patch<UserInterface>(`${environment.URL}/api/users/update-user/${id}`, {
      name,
      birthday,
      lastname,
      email,
      phone
    }).subscribe({
      next: (res: any) => {
        console.log('✅ updateMyUser - Respuesta:', res);
        this._userStorage.saveUser(res['user']);
      },
      error: (err) => {
        console.error('❌ updateMyUser - Error:', err);
      }
    });
  }

  // ✅ MÉTODO CON TOASTS AUTOMÁTICOS
  updateUserWithToast(id: any, name: string, lastname: string, birthday: string, email: string, phone: string) {
    console.log('🔄 UserService.updateUserWithToast:', { birthday, name, lastname, email, phone });
    
    return this._htpp.patch<UserInterface>(`${environment.URL}/api/users/update-user/${id}`, {
      name,
      birthday,
      lastname,
      email,
      phone
    }).subscribe({
      next: async (res) => {
        await this.correctlyToast();
        console.log('✅ updateUserWithToast - Respuesta:', res);
      },
      error: async (err) => {
        await this.errorToast();
        console.error('❌ updateUserWithToast - Error:', err);
      }
    });
  }

  async correctlyToast() {
    const toast = await this.toastController.create({
      message: 'Cambios guardados correctamente!',
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      header: 'Ha ocurrido un error al cambiar los datos!',
      message: 'Por favor intente nuevamente',
      duration: 2000,
      position: 'bottom'
    });

    await toast.present();
  }

  deleteUserById(id: any) {
    return this._htpp.patch(`${environment.URL}/api/users/delete-user/${id}`, {});
  }
}

/* 25-8import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { environment } from 'src/environments/environment';
import { UserStorageService } from '../storage/user-storage.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _htpp :HttpClient,
    private _userStorage: UserStorageService,
    private toastController: ToastController
  ) { }

    getUserByID(id){

      return this._htpp.get<any>(`${environment.URL}/api/users/${id}`)

    }

    updateMyUser(id, name, lastname, birthday, email, phone){
      console.log(birthday, name, lastname, email, phone );


      return this._htpp.patch<UserInterface>(`${environment.URL}/api/users/update-user/${id}`, {
        name,
        birthday,
        lastname, 
        email, 
        phone
      }).subscribe(res => 
        {
          console.log(res);
          this._userStorage.saveUser(res['user'])
        } )
    }

    updateUser(id, name, lastname, birthday, email, phone){
      console.log(birthday, name, lastname, email, phone );


      return this._htpp.patch<UserInterface>(`${environment.URL}/api/users/update-user/${id}`, {
        name,
        birthday,
        lastname, 
        email, 
        phone
      }).subscribe(async res => 
        {
          await this.correctlyToast()
          console.log(res);
        },
        async err => {
          await this.errorToast()
        } 
        )
    }

    
    async correctlyToast() {
      const toast = await this.toastController.create({
        message: 'Cambios guardados correctamente!',
        duration: 2000,
        position: 'bottom'
      });
  
      await toast.present();
    }
  
    async errorToast() {
      const toast = await this.toastController.create({
        header: 'Ha ocurrido un error al cambiar los horarios!',
        message: 'Por favor intente nuevamente',
        duration: 2000,
        position: 'bottom'
      });
  
      await toast.present();
    }

    deleteUserById(id){
      return this._htpp.patch(`${environment.URL}/api/users/delete-user/${id}`, {})
    }

}*/
