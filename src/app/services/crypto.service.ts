import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  encryptionKey: string = 'Leaf1234!';

  //The set method is use for encrypt the value.
  set(value: any): void {
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      this.encryptionKey
    ).toString();
    localStorage.setItem('user', encrypted);
  }

  //The get method is use for decrypt the value.
  get(): any {
    let user = localStorage.getItem('user');
    if (user) {
      let decrypted = JSON.parse(
        CryptoJS.AES.decrypt(user, this.encryptionKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      return decrypted;
    }
    return {};
  }
}
