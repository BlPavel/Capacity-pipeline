import { FittingListService } from './fitting-list.service';
import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow, Paragraph } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { Plug } from '../../../interfaces/plug.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class PlugListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _fittingList: FittingListService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.plugs, i).length === 0){
      return []
    } else{
      const textItem: string = `5.${this.setNumberItem(i)} Параметры арматуры (заглушки)`;
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
          this._createTablePlug(i),
          ...this._createSignatures(i)
        ]
      }];
      return sections;
    };
  };

  public setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.plugs, i).length === 0 ?
      this._fittingList.setNumberItem(i) :
      this._fittingList.setNumberItem(i) + 1;
    return numberItem;
  }

  private _createTablePlug(i: number): Table{
    return this._table.createTable(
      this._createTablePlugHead(),
      this._createTablePlugBody(i));
  };

  private _createTablePlugHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 10,text: "Условный проход, мм, Dy", },
      { size: 20,text: "Наименование", },
      { size: 20,text: "Тип", },
      { size: 10,text: "Строительная длина, мм", },
      { size: 10,text: "Количество" }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 20, text: "2" },
      { size: 10, text: "3" },
      { size: 20, text: "4" },
      { size: 20, text: "5" },
      { size: 10, text: "6" },
      { size: 10, text: "7" }
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    return tableHead;
  };

  private _createTablePlugBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterPlugsByPipeLine: Plug[] = this._el.filterByPipeLine(
      this._el.plugs, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterPlugsByDistrict = this._el.filterByDistrict(
        filterPlugsByPipeLine, k);
      if(filterPlugsByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textDiametr: string = filterPlugsByDistrict[0].nominalDiametr.toString();
      const textLength: string = filterPlugsByDistrict[0].length.toString();
      const textQuantity: string = filterPlugsByDistrict[0].quantity.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterPlugsByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterPlugsByDistrict.length
        },
        { size: 10, text: textDiametr },
        { size: 20, text: "Заглушка" },
        { size: 20, text: filterPlugsByDistrict[0].type },
        { size: 10, text: textLength },
        { size: 10, text: textQuantity }
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterPlugsByDistrict.length; j++){
        const textDiametr: string = filterPlugsByDistrict[j].nominalDiametr.toString();
        const textLength: string = filterPlugsByDistrict[j].length.toString()
        const textQuantity: string = filterPlugsByDistrict[j].quantity.toString()
         const dataOtherRow: ICell[] = [
          { size: 10, text: textDiametr },
          { size: 20, text: "Заглушка" },
          { size: 20, text: filterPlugsByDistrict[j].type },
          { size: 10, text: textLength },
          { size: 10, text: textQuantity }
         ];
         tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };

  private _createSignatures(i: number): Paragraph[] | []{
    const quantityNextList: number =
    this._el.filterByPipeLine(this._el.offsets, i).length +
    this._el.filterByPipeLine(this._el.reducers, i).length +
    this._el.filterByPipeLine(this._el.tees, i).length +
    this._el.filterByPipeLine(this._el.equipments, i).length;

    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
