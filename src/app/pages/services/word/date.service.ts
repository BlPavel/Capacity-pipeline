import { Injectable } from '@angular/core';
import { ElementsService } from '../elements.service';

@Injectable({ providedIn: 'root' })
export class DateService {
  constructor( private readonly _el: ElementsService ){};

  public getDay():string{
    return this._el.commonData.date.toString().split('-')[2];
  };

  public getMounth():string{
    return this._el.commonData.date.toString().split('-')[1];
  };

  public getYear():string{
    return this._el.commonData.date.toString().split('-')[0];
  };
};
