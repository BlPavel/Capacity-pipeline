import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  public set(key: string, date: {}): void {
    try {
      localStorage.setItem(key, JSON.stringify(date));
    } catch (e) {
      console.log('Error', e);
    }
  }

  public get(key: string) {
    try {
      if (localStorage.getItem(key) !== null) {
        return JSON.parse(localStorage.getItem(key) || '');
      } else return '';
    } catch (e) {
      console.log('Error', e);
    }
  }

  public delete(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.log('Error', e);
    }
  }
}
