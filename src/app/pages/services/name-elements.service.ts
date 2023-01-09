import { Tee } from './../interfaces/tee.interface';
import { Reducer } from './../interfaces/reducer.interface';
import { Offset } from './../interfaces/offset.interface';
import { Plug } from './../interfaces/plug.interface';
import { Injectable } from '@angular/core';
import { Elements } from '../interfaces/elements.type';
import { Fitting } from '../interfaces/fitting.interface';
import { Equipment } from '../interfaces/equipment.interfaces';

@Injectable({ providedIn: 'root' })
export class NameElementsService {
  public get(elements: Elements): string{
    let string: string =''
    let hasTextBefore: boolean = false;
    if(this._getNameFitting(elements[0])){
      string += this._getNameFitting(elements[0]);
      hasTextBefore = true;
    };
    if(this._getNamePlug(elements[1])){
      string += hasTextBefore === true ?
      ", " + this._getNamePlug(elements[1]) :
      this._getNamePlug(elements[1]);
      hasTextBefore = true;
    };
    if(this._getNameOffset(elements[2])){
      string += hasTextBefore === true ?
      ", " + this._getNameOffset(elements[2]) :
      this._getNameOffset(elements[2]);
      hasTextBefore = true;
    }
    if(this._getNameReducer(elements[3])){
      string += hasTextBefore === true ?
      ", " + this._getNameReducer(elements[3]) :
      this._getNameReducer(elements[3]);
      hasTextBefore = true;
    }
    if(this._getNameTee(elements[4])){
      string += hasTextBefore === true ?
      ", " + this._getNameTee(elements[4]) :
      this._getNameTee(elements[4]);
      hasTextBefore = true;
    }
    if(this._getNameEquipment(elements[5])){
      string += hasTextBefore === true ?
      ", " + this._getNameEquipment(elements[5]) :
      this._getNameEquipment(elements[5]);
    }
    return string;
  }

  private _getNameFitting(fittings: Fitting[]): string{
    const uniqName: string[] = [...new Set(
      fittings.map(item=>{
        return item['type']
      })
    )];
    if(uniqName.length){
      return uniqName.toString().split(',').join(', ')
    }
    else return "";
  };

  private _getNamePlug(plugs: Plug[]): string{
    const uniqName: string[] = [...new Set(
      plugs.map(item=>{
        return item['type']
      })
    )];
    if(uniqName.length){
      for(let i = 0; i < uniqName.length; i++){
        uniqName[i] = "Заглушка " + uniqName[i].toLowerCase()
      };
      return uniqName.toString().split(',').join(', ')
    }
    else return "";
  };

  private _getNameOffset(offsets: Offset[]): string{
    const uniqName: string[] = [...new Set(
      offsets.map(item=>{
        return item['type']
      })
    )];
    if(uniqName.length){
      return uniqName.toString().split(',').join(', ')
    }
    else return "";
  };

  private _getNameReducer(reducers: Reducer[]): string{
    const uniqName: string[] = [...new Set(
      reducers.map(item=>{
        return item['type']
      })
    )];
    if(uniqName.length){
      for(let i = 0; i < uniqName.length; i++){
        uniqName[i] = "Переход " + uniqName[i].toLowerCase()
      };
      return uniqName.toString().split(',').join(', ')
    }
    else return "";
  };

  private _getNameTee(tees: Tee[]): string{
    const diametr: number[][] = [...new Set(
      tees.map(item=>{
        return [item['nominalDiametr'], item['diametrBranch']]
      })
    )];
    let name: string[] = []
    for(let i = 0; i < diametr.length; i++){
      if(diametr[i][0] === diametr[i][1]){
        name.push("Тройник проходной");
      } else{
        name.push("Тройник переходной");
      };
    };
    const uniqName: string[] = [...new Set(name)];
    if(uniqName.length){
      return uniqName.toString().split(',').join(', ')
    }
    else return"";
  };

  private _getNameEquipment(equipments: Equipment[]): string{
    const uniqName: string[] = [...new Set(
      equipments.map(item=>{
        return item['name']
      })
    )];
    if(uniqName.length){
      return uniqName.toString().split(',').join(', ')
    }
    else return "";
  };
};
