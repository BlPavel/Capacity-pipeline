import { GraduationDistrictListService } from './graduation-district-list.service';
import { CapacityListService } from './capacity-list.service';
import { EquipmentListService } from './equipment-list.service';
import { TeeListService } from './tee-list.service';
import { ReducerListService } from './reducer-list.service';
import { OffsetListService } from './offset-list.service';
import { PlugListService } from './plug-list.service';
import { FittingListService } from './fitting-list.service';
import { PipeListService } from './pipe-list.service';
import { ElementsService } from '../../elements.service';
import { SchemeListService } from './scheme-list.service';
import { ProtokolMainListService } from './protokol-main-list.service';
import { ReportService } from '../../report.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProtokolListsService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _protokolMainList: ProtokolMainListService,
    private readonly _schemeList: SchemeListService,
    private readonly _pipeList: PipeListService,
    private readonly _fittingList: FittingListService,
    private readonly _plugList: PlugListService,
    private readonly _offsetList: OffsetListService,
    private readonly _reducerList: ReducerListService,
    private readonly _teeList: TeeListService,
    private readonly _equipmentList: EquipmentListService,
    private readonly _capacityList: CapacityListService,
    private readonly _gradDistrictList: GraduationDistrictListService,
    ){};

  public createLists(): any[]{
    const protokols: any[] = []
    for (let i = 0; i < this._el.namePipeLines.length; i++){
      protokols.push(
        ...this._protokolMainList.createList(i),
        ...this._schemeList.createList(),
        ...this._pipeList.createList(i),
        ...this._fittingList.createList(i),
        ...this._plugList.createList(i),
        ...this._offsetList.createList(i),
        ...this._reducerList.createList(i),
        ...this._teeList.createList(i),
        ...this._equipmentList.createList(i),
        ...this._capacityList.createList(i),
        ...this._gradDistrictList.createList(i)
        );
    };
    return protokols;
  };
};
