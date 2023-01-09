import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow, Paragraph } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { OffsetListService } from './offset-list.service';
import { Reducer } from '../../../interfaces/reducer.interface';
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class ReducerListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _offsetList: OffsetListService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.reducers, i).length === 0){
      return []
    } else{
      const textItem: string = `5.${this.setNumberItem(i)} Параметры фитинга (переходы)`;
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
          this._createTableReducer(i),
          ...this._createSignatures(i)
        ]
      }];
      return sections;
    };
  };

  public setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.reducers, i).length === 0 ?
      this._offsetList.setNumberItem(i) :
      this._offsetList.setNumberItem(i) + 1;
    return numberItem;
  };

  private _createTableReducer(i: number): Table{
    return this._table.createTable(
      this._createTableReducerHead(),
      this._createTableReducerBody(i));
  };

  private _createTableReducerHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 20,text: "Тип перехода", },
      { size: 12,text: "Условный проход, мм, Dy", },
      { size: 12,text: "Условный проход, мм, dx", },
      { size: 16,text: "Строительная длина, мм", },
      { size: 10,text: "Количество" }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 20, text: "2" },
      { size: 20, text: "3" },
      { size: 12, text: "4" },
      { size: 12, text: "5" },
      { size: 16, text: "6" },
      { size: 10, text: "7" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    return tableHead;
  };

  private _createTableReducerBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterReducersByPipeLine: Reducer[] = this._el.filterByPipeLine(
      this._el.reducers, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterReducersByDistrict = this._el.filterByDistrict(
        filterReducersByPipeLine, k);
      if(filterReducersByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textDiametr: string = filterReducersByDistrict[0].nominalDiametr.toString();
      const textLength: string = filterReducersByDistrict[0].length.toString();
      const textDiametrAfter: string = filterReducersByDistrict[0].diametrAfterReducer.toString();
      const textQuantity: string = filterReducersByDistrict[0].quantity.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterReducersByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterReducersByDistrict.length
        },
        { size: 20, text: filterReducersByDistrict[0].type },
        { size: 12, text: textDiametr },
        { size: 12, text: textDiametrAfter },
        { size: 16, text: textLength },
        { size: 10, text: textQuantity },
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterReducersByDistrict.length; j++){
        const textDiametr: string = filterReducersByDistrict[j].nominalDiametr.toString();
        const textLength: string = filterReducersByDistrict[j].length.toString();
        const textDiametrAfter: string = filterReducersByDistrict[j].diametrAfterReducer.toString();
        const textQuantity: string = filterReducersByDistrict[j].quantity.toString();
         const dataOtherRow: ICell[] = [
          { size: 20, text: filterReducersByDistrict[j].type },
          { size: 12, text: textDiametr },
          { size: 12, text: textDiametrAfter },
          { size: 16, text: textLength },
          { size: 10, text: textQuantity },
         ];
         tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };

  private _createSignatures(i: number): Paragraph[] | []{
    const quantityNextList: number =
    this._el.filterByPipeLine(this._el.tees, i).length +
    this._el.filterByPipeLine(this._el.equipments, i).length;

    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
