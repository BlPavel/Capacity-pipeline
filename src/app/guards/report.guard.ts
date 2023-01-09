import { ValidCommon } from './../pages/interfaces/valid-common.interfaces';
import { ValidSection } from './../pages/interfaces/valid-section.interfaces';
import { ValidPipe } from './../pages/interfaces/valid-pipe.interface';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ReportGuard implements CanActivate {
  public isValidCommonData: ValidCommon = {
    isValid: true,
    hasRepeat: false
  };
  public isValidSectionBoundary: ValidSection = {
    isValid: true,
    hasAllPipeLine: true,
    hasRepeat: false
  };
  public isValidPipe: ValidPipe = {
    isValid: true,
    missingData: ''
  };
  public isValidOffset: boolean = true;
  public isValidReducer: boolean = true;
  public isValidTee: boolean = true;
  public isValidPlug: boolean = true;
  public isValidFitting: boolean = true;
  public isValidEquipment: boolean = true;

  public canActivate(): boolean  {
    let canActivete: boolean = true;

    if(!this.isValidCommonData.isValid){
      alert(`Заполните все поля в разделе "Общие данные"!!!`);
      canActivete = false;
    };

    if(this.isValidCommonData.hasRepeat){
      alert(`Удалите повторяющиеся трубопроводы в разделе "Общие данные"!!!`);
      canActivete = false;
    };

    if(!this.isValidSectionBoundary.isValid){
      alert(`Заполните все поля в разделе "Границы"!!!`);
      canActivete = false;
    };

    if(!this.isValidSectionBoundary.hasAllPipeLine){
      alert(`Введите все трубопроводы в разделе "Границы"!!!`);
      canActivete = false;
    };

    if(this.isValidSectionBoundary.hasRepeat){
      alert(`Удалите повторяющиеся пункты в разделе "Границы"!!!`);
      canActivete = false;
    };

    if(!this.isValidPipe.isValid){
      alert(`Заполните все поля в разделе "Труба"!!!`);
      canActivete = false;
    };

    if(this.isValidPipe.missingData){
      alert(this.isValidPipe.missingData);
      canActivete = false;
    };

    if(!this.isValidOffset){
      alert(`Заполните все поля в разделе "Отвод"!!!`);
      canActivete = false;
    };

    if(!this.isValidReducer){
      alert(`Заполните все поля в разделе "Переход"!!!`);
      canActivete = false;
    };

    if(!this.isValidTee){
      alert(`Заполните все поля в разделе "Тройник"!!!`);
      canActivete = false;
    };

    if(!this.isValidPlug){
      alert(`Заполните все поля в разделе "Заглушка"!!!`);
      canActivete = false;
    };

    if(!this.isValidFitting){
      alert(`Заполните все поля в разделе "Арматура"!!!`);
      canActivete = false;
    };


    if(!this.isValidEquipment){
      alert(`Заполните все поля в разделе "Оборудование"!!!`);
      canActivete = false;
    };

    return canActivete;
  };
};
