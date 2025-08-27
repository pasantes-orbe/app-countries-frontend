//app/services/storage/user-storage.service.ts
import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private _storage: Storage | null = null;
  private _initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this._initPromise = this.init();
  }

  async init() {
    if (!this._storage) {
      const storage = await this.storage.create();
      this._storage = storage;
      console.log('💾 UserStorage: Inicializado correctamente');
    }
  }

  private async ensureInit(): Promise<void> {
    await this._initPromise;
  }

  public async saveUser(user: UserInterface): Promise<void> {
    await this.ensureInit();
    console.log('💾 UserStorage: Guardando usuario:', user);
    await this._storage?.set('user', user);
  }

  public async getUser(): Promise<UserInterface | null> {
    await this.ensureInit();
    const user = await this._storage?.get('user');
    console.log('📖 UserStorage: Obteniendo usuario:', user);
    return user;
  }

  public async signOut(): Promise<void> {
    await this.ensureInit();
    await this._storage?.remove('user');
  }

  public async removeUser(): Promise<void> {
    await this.ensureInit();
    await this._storage?.remove('user');
  }
}

/*24-8 import { Injectable } from '@angular/core';
import { UserInterface } from 'src/app/interfaces/user-interface';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async saveUser(user: UserInterface): Promise<void> {
    await this._storage?.set('user', user);
  }

  public async getUser(): Promise<UserInterface | null> {
    return await this._storage?.get('user');
  }

  public async signOut(): Promise<void> {
    await this._storage?.remove('user');
    // Redirect to login or handle sign out logic
  }

  public async removeUser(): Promise<void> {
    await this._storage?.remove('user');
  }
}*/
