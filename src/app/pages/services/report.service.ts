import { GraduationByPipeLine } from './../interfaces/graduation-pipeline.interface';
import { StoreService } from './store.service';
import { CapacityPipeLine } from '../interfaces/capacity-pipeline.interface';
import { SectionBoundary } from './../interfaces/section-boundary.interface';
import { Injectable } from '@angular/core';
import { ElementsService } from './elements.service';
import { GraduationByDistrict } from '../interfaces/graduation-district.interface';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(
    private readonly _el: ElementsService,
    private readonly _store: StoreService
    ){};


  public calculatesGraduationByDistrict(i: number){
    let result: any[] = [];
    let lengthCumulative: number = 0;
    let capacityCumulative: number = 0;
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const capacityPipeLine: CapacityPipeLine[]
      = this._store.capacityPipeLine[i]
      const filterCapacityPipeLineByDistrict: CapacityPipeLine[] =
      capacityPipeLine.filter(item=>{
        return item.numberDistrict === k + 1
      });

      const numberPipeline: number = i + 1;
      const numberDistrict: number = k + 1;
      const nameDistrict: string =
      filterCapacityPipeLineByDistrict[0].nameDistrict;
      const length: number = filterCapacityPipeLineByDistrict.
      map(item=>{
        return item['lengthPipeLine']
      }).reduce((accum, item)=>{
        return accum + item
      }) / 1000;
      const capacityPipe: number = filterCapacityPipeLineByDistrict.
      map(item=>{
        return item['capacity']['pipe']
      }).reduce((accum, item)=>{
        return accum + item
      });
      const capacityOffset: number = filterCapacityPipeLineByDistrict.
      map(item=>{
        return item['capacity']['offset']
      }).reduce((accum, item)=>{
        return accum + item
      });
      const capacityOther: number = filterCapacityPipeLineByDistrict.
      map(item=>{
        return item['capacity']['other']
      }).reduce((accum, item)=>{
        return accum + item
      });
      const capacity: number = Math.round(
        (capacityPipe + capacityOffset + capacityOther)
        * 1000) / 1000;
      lengthCumulative += length;
      capacityCumulative += capacity;

      const graduation: GraduationByDistrict = {
        numberPipeline, numberDistrict,
        nameDistrict, length, capacity,
        lengthCumulative:
        Math.round( lengthCumulative * 1000 ) / 1000,
        capacityCumulative:
        Math.round( capacityCumulative * 1000 ) / 1000,
      };

      result.push(graduation);
    };
    return result;
  };

  public calculatesGraduationByPipeLine(): GraduationByPipeLine[]{
    let result: GraduationByPipeLine[] = [];
    let lengthCumulative: number = 0;
    let capacityCumulative: number = 0;
    const data: GraduationByDistrict[][] =
    this._store.graduationDistrict;
    const namePipeLines: string[] = this._el.namePipeLines;
    for(let i = 0; i < namePipeLines.length; i++){
      const filterDataByPipeLine: GraduationByDistrict[] = data[i];

      const numberPipeLine: number = i + 1;
      const nameBorder: string = this._el.commonData.pipeLine[i].nameBorder;
      const length: number = Math.round(
        filterDataByPipeLine.map(item => {
          return item['length']
        }).reduce((accum, item) => {
          return accum + item
        }) * 1000 ) / 1000;
      const capacity: number = Math.round(
        filterDataByPipeLine.map(item => {
          return item['capacity']
        }).reduce((accum, item) => {
          return accum + item
        }) * 1000 ) / 1000;
      lengthCumulative += length;
      capacityCumulative += capacity;

      const graduation: GraduationByPipeLine = {
        numberPipeLine, nameBorder, length, capacity,
        lengthCumulative:
        Math.round( lengthCumulative * 1000 ) / 1000,
        capacityCumulative:
        Math.round( capacityCumulative * 1000 ) / 1000
      };

      result.push(graduation)
    };
    return result;
  };
};
