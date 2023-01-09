import { Tee } from '../interfaces/tee.interface';
import { Offset } from '../interfaces/offset.interface';
import { CommonData } from '../interfaces/common-data.interface';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { PipeLine } from '../interfaces/common-data.interface';
import { MinInfo } from '../interfaces/min-info.interface';
import { SectionBoundary } from '../interfaces/section-boundary.interface';
import { Pipe } from '../interfaces/pipe.inteerface';
import { Fitting } from '../interfaces/fitting.interface';
import { Plug } from '../interfaces/plug.interface';
import { Reducer } from '../interfaces/reducer.interface';
import { Equipment } from '../interfaces/equipment.interfaces';
import { NominalDiametr } from '../interfaces/nominal-diametr.interface';



@Injectable({ providedIn: 'root' })
export class ElementsService {

  constructor(private readonly _LS: LocalStorageService){};

  public get commonData(): CommonData{
    return this._getCommonData()
  };

  public get namePipeLines(): string[]{
    return this._getNamePipeLines();
  };

  public get sectionBoundarys(): SectionBoundary[]{
    return this._getSectionBoundarys()
  };

  public get pipes():Pipe[]{
    return this._getPipes();
  };

  public get fittings():Fitting[]{
    return this._getFittings();
  };

  public get plugs(): Plug[]{
    return this._getPlugs();
  };

  public get offsets(): Offset[]{
    return this._getOffsets();
  };

  public get reducers(): Reducer[]{
    return this._getReducers();
  };

  public get tees(): Tee[]{
    return this._getTees();
  };

  public get equipments(): Equipment[]{
    return this._getEquipments();
  };

  private _getCommonData(): CommonData{
    return this._LS.get('commonData');
  }

  private _getNamePipeLines(): string[]{
    let namePipeLines: string[] = [];
    const pipeLines: PipeLine[] = this._LS.get('commonData').pipeLine;
    const sortedArray: PipeLine[] = pipeLines.sort((a:PipeLine, b:PipeLine)=>{
      return a.numberPipeLine - b.numberPipeLine
    })
    sortedArray.forEach( item=>{
      namePipeLines.push(item.namePipeLine)
    })
    return namePipeLines;
  };

  private _getSectionBoundarys(): SectionBoundary[]{
    const sectionBoundarys: SectionBoundary[] =
    this._LS.get('sectionBoundary').sectionBoundary;
    return this._sortElements<SectionBoundary>(sectionBoundarys);
  };

  private _getPipes():Pipe[]{
    const pipes: Pipe[] = this._LS.get('pipe').pipe;
    return this._sortElements<Pipe>(pipes);
  };

  private _getFittings(): Fitting[]{
    const fittings: Fitting[] = this._LS.get('fitting').fitting;
    if(fittings){
      return this._sortElements<Fitting>(fittings);
    } else return []
  };

  private _getPlugs(): Plug[]{
    const plug: Plug[] = this._LS.get('plug').plug;
    if(plug){
      return this._sortElements<Plug>(plug);
    } else return [];
  };

  private _getOffsets(): Offset[]{
    const offset: Offset[] = this._LS.get('offset').offset;
    if(offset){
      return this._sortElements<Offset>(offset);
    } else return [];
  };

  private _getReducers(): Reducer[]{
    const reducer: Reducer[] = this._LS.get('reducer').reducer;
    if(reducer){
      return this._sortElements<Reducer>(reducer);
    } else return [];
  };

  private _getTees(): Tee[]{
    const tee: Tee[] = this._LS.get('tee').tee;
    if(tee){
      return this._sortElements<Tee>(tee);
    } else return [];
  };

  private _getEquipments(): Equipment[]{
    const equipment: Equipment[] = this._LS.get('equipment').equipment;
    if(equipment){
      return this._sortElements<Equipment>(equipment);
    } else return [];
  };

  public filterByPipeLine<T extends MinInfo>(array: T[], i: number): T[]{
    return array.filter(elem=>{
    return elem.numberPipeline === i + 1
   });
  };

 public filterByDistrict<T extends MinInfo>(array: T[], k: number): T[]{
   return array.filter(elem=>{
    return elem.numberDistrict === k + 1
   });
 };

 public filterByDiametr<T extends NominalDiametr>(array: T[], diametr: number): T[]{
   return array.filter(elem=>{
    return elem.nominalDiametr === diametr
   });
 };

  private _sortElements<T extends MinInfo>(array: T[]): T[]{
    const sortedArray: T[] = array.sort(
      (a:T, b:T) => {
      if (a.numberPipeline > b.numberPipeline) return 1
      else if(a.numberPipeline < b.numberPipeline) return -1
      else {
        if(a.numberDistrict > b.numberDistrict) return 1
        else if(a.numberDistrict < b.numberDistrict) return -1
        else return 0
      }
    })
    return sortedArray;
  };


};
