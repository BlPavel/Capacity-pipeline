import { PageOrientation } from 'docx';
import { ItemService } from '../item.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SchemeListService {

  constructor(private readonly _item: ItemService){};

  public createList(): any[]{
    const sections = [{
      properties: {
        page: {
          margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1500,
          },
          size:{
            orientation: PageOrientation.LANDSCAPE,
          }
        },
      },
      children: [ this._item.create('4. Монтажно-граничная схема') ]
    }];
    return sections;
  };
};
