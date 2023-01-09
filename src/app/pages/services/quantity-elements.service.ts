import { Elements } from './../interfaces/elements.type';
import { Injectable } from '@angular/core';
import { Quantity } from '../interfaces/quantity.interface';

@Injectable({ providedIn: 'root' })

export class QuantityElementsService {
  public calculates(elements: Elements): number{
    let result = 0;
    result += this._calculatesSumElements(elements[0]);
    result += this._calculatesSumElements(elements[1]);
    result += this._calculatesSumElements(elements[2]);
    result += this._calculatesSumElements(elements[3]);
    result += this._calculatesSumElements(elements[4]);
    result += this._calculatesSumElements(elements[5]);
    return result;
  };

  private _calculatesSumElements<T extends Quantity>(element: T[]): number{
    let result = 0
    for(let i = 0; i < element.length; i++){
      for(let k = 0; k < element[i].quantity; k++){
        result++
      };
    };
    return result;
  };
};
