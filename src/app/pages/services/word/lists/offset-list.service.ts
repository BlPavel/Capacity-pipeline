import { PlugListService } from './plug-list.service';
import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow, Paragraph } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { Offset } from '../../../interfaces/offset.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class OffsetListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _plugList: PlugListService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.offsets, i).length === 0){
      return []
    } else{
      const textItem: string = `5.${this.setNumberItem(i)} Параметры фитинга (отводы)`;
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
        children: [
          this._item.create(textItem),
          this._createTableOffset(i),
          ...this._createSignatures(i)
        ]
      }];
      return sections;
    };
  };

  public setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.offsets, i).length === 0 ?
      this._plugList.setNumberItem(i) :
      this._plugList.setNumberItem(i) + 1;
    return numberItem;
  };

  private _createTableOffset(i: number): Table{
    return this._table.createTable(
      this._createTableOffsetHead(),
      this._createTableOffsetBody(i));
  };

  private _createTableOffsetHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 10,text: "Условный проход, мм, Dy", },
      { size: 20,text: "Наименование", },
      { size: 15,text: "Строительная длина, мм, L1", },
      { size: 15,text: "Строительная длина, мм, L2", },
      { size: 10,text: "Количество" }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 20, text: "2" },
      { size: 10, text: "3" },
      { size: 20, text: "4" },
      { size: 15, text: "5" },
      { size: 15, text: "6" },
      { size: 10, text: "7" }
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    return tableHead;
  };

  private _createTableOffsetBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterOffsetsByPipeLine: Offset[] = this._el.filterByPipeLine(
      this._el.offsets, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterOffsetsByDistrict = this._el.filterByDistrict(
        filterOffsetsByPipeLine, k);
      if(filterOffsetsByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textDiametr: string = filterOffsetsByDistrict[0].nominalDiametr.toString();
      const textLength1: string = filterOffsetsByDistrict[0].length1.toString();
      const textLength2: string = filterOffsetsByDistrict[0].length2.toString();
      const textQuantity: string = filterOffsetsByDistrict[0].quantity.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterOffsetsByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterOffsetsByDistrict.length
        },
        { size: 10, text: textDiametr },
        { size: 20, text: filterOffsetsByDistrict[0].type },
        { size: 15, text: textLength1 },
        { size: 15, text: textLength2 },
        { size: 10, text: textQuantity }
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterOffsetsByDistrict.length; j++){
        const textDiametr: string = filterOffsetsByDistrict[j].nominalDiametr.toString();
        const textLength1: string = filterOffsetsByDistrict[j].length1.toString();
        const textLength2: string = filterOffsetsByDistrict[j].length2.toString();
        const textQuantity: string = filterOffsetsByDistrict[j].quantity.toString();
         const dataOtherRow: ICell[] = [
          { size: 10, text: textDiametr },
          { size: 20, text: filterOffsetsByDistrict[j].type },
          { size: 15, text: textLength1 },
          { size: 15, text: textLength2 },
          { size: 10, text: textQuantity }
         ];
         tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };

  private _createSignatures(i: number): Paragraph[] | []{
    const quantityNextList: number =
    this._el.filterByPipeLine(this._el.reducers, i).length +
    this._el.filterByPipeLine(this._el.tees, i).length +
    this._el.filterByPipeLine(this._el.equipments, i).length;

    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
