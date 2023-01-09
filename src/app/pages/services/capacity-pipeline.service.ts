import { CapacityElementsService } from './capacity-elements.service';
import { LengthPipelineService } from './length-pipeline.service';
import { QuantityElementsService } from './quantity-elements.service';
import { NameElementsService } from './name-elements.service';
import { CapacityPipeLine } from '../interfaces/capacity-pipeline.interface';
import { Tee } from './../interfaces/tee.interface';
import { Reducer } from './../interfaces/reducer.interface';
import { Offset } from './../interfaces/offset.interface';
import { Plug } from './../interfaces/plug.interface';
import { SectionBoundary } from './../interfaces/section-boundary.interface';
import { Injectable } from '@angular/core';
import { Pipe } from '../interfaces/pipe.inteerface';
import { ElementsService } from './elements.service';
import { Fitting } from '../interfaces/fitting.interface';
import { Equipment } from '../interfaces/equipment.interfaces';
import { Elements } from '../interfaces/elements.type';
import { NominalDiametr } from '../interfaces/nominal-diametr.interface';

@Injectable({ providedIn: 'root' })
export class CapacityPipeLineService {
  constructor(
    private readonly _el: ElementsService,
    private readonly _capacityEl: CapacityElementsService,
    private readonly _nameEl: NameElementsService,
    private readonly _quantityEl: QuantityElementsService,
    private readonly _lengthPipeline: LengthPipelineService,
    ){};

  public calculatesCapacityPipeLines(i: number){
    let result: CapacityPipeLine[] = []
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);
    const filterPipesByPipeLine: Pipe[] = this._el.filterByPipeLine(
      this._el.pipes, i);
    let capacityCumulative: number = 0

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const filterPipesByDistrict = this._el.filterByDistrict(
        filterPipesByPipeLine, k);
      const uniqDiametr: number[] = [...new Set(filterPipesByDistrict.map(item=>{
        return item['nominalDiametr']}))].sort((a:number, b:number) => a-b )

      for(let j = 0; j < uniqDiametr.length; j++){
        const pipes: Pipe[] = this._el.filterByDiametr(filterPipesByDistrict, uniqDiametr[j]);
        const fittings: Fitting[] = this._filterElement(i, k, uniqDiametr[j], this._el.fittings);
        const plugs: Plug[] = this._filterElement(i, k, uniqDiametr[j], this._el.plugs);
        const offsets: Offset[] = this._filterElement(i, k, uniqDiametr[j], this._el.offsets);
        const reducers: Reducer[] = this._filterElement(i, k, uniqDiametr[j], this._el.reducers);
        const tees: Tee[] = this._filterElement(i, k, uniqDiametr[j], this._el.tees);
        const equipments: Equipment[] = this._filterElement(i, k, uniqDiametr[j], this._el.equipments);
        const elements: Elements = [fittings, plugs, offsets, reducers, tees, equipments];
        const capacityPart: number = this._capacityEl.calculatesCapacitePart(pipes, elements);
        capacityCumulative += Math.round( capacityPart * 1000 ) / 1000;

        const capacityPipeLine: CapacityPipeLine = {
          numberDistrict: filterSectionBoundarysByDistrict[0].numberDistrict,
          nameDistrict: filterSectionBoundarysByDistrict[0].name,
          nameElements: this._nameEl.get(elements),
          quantityElements: this._quantityEl.calculates(elements),
          lengthPipeLine: this._lengthPipeline.calculates(elements, pipes),
          nominalDiametr: pipes[0].nominalDiametr,
          capacity:{
            pipe: this._capacityEl.calculatesPipes(pipes),
            offset: this._capacityEl.calculatesOffsets(elements),
            other: this._capacityEl.calculatesOtherElements(elements)
          },
          capacityPart,
          capacityCumulative: +capacityCumulative.toFixed(3)
        };
        result.push(capacityPipeLine);
      };
    };
    return result;
  };

  private _filterElement<T extends NominalDiametr>(
    i: number,
    k: number,
    j: number,
    element: T[]
    ): T[]{
    const filterByPipeLine: T[] =
    this._el.filterByPipeLine(element, i);
    const filterByDistrict: T[] =
    this._el.filterByDistrict(filterByPipeLine, k);
    const filterByDiametr: T[] =
    this._el.filterByDiametr(filterByDistrict, j);
    return filterByDiametr;
  };
};
