//app/services/storage/auth-storage.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor(
  ) { }

  public async saveJWT(jwt: string): Promise<void> {
    await Preferences.set({
      key: 'JWT',
      value: JSON.stringify(jwt)
    });
  }

  public async getJWT(): Promise<string> {

    const { value } = await Preferences.get({ key: 'JWT' });
    return JSON.parse(value);

  }
  public async remove(): Promise<void> {
    await Preferences.remove({ key: 'JWT' });
  }
}
