import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _isModalOpen: boolean = false;
  private _addAccountModal: boolean = false;
  constructor() {}

  changeModal(boolean: boolean): void {
    this._isModalOpen = boolean;
  }

  accessNewAccountModal(boolean: boolean): void {
    this._addAccountModal = boolean;
  }

  get isModalOpen(): boolean {
    return this._isModalOpen;
  }

  get addAccountModal(): boolean {
    return this._addAccountModal;
  }
}
