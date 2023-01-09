import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow, Paragraph } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { Fitting } from '../../../interfaces/fitting.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class FittingListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.fittings, i).length === 0){
      return []
    } else{
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
          this._item.create('5.2 Параметры арматуры (задвижки, клапаны, краны)'),
          this._createTableFitting(i),
          ...this._createSignatures(i)
        ]
      }];
      return sections;
    };
  };

  public setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.fittings, i).length === 0 ? 1 : 2
    return numberItem;
  };

  private _createTableFitting(i: number): Table{
    return this._table.createTable(
      this._createTableFittingHead(),
      this._createTableFittingBody(i));
  };

  private _createTableFittingHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 10,text: "Условный проход, мм, Dy", },
      { size: 20,text: "Наименование", },
      { size: 20,text: "Вместимость", },
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

  private _createTableFittingBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterFittingsByPipeLine: Fitting[] = this._el.filterByPipeLine(
      this._el.fittings, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterFittingsByDistrict = this._el.filterByDistrict(
        filterFittingsByPipeLine, k);
      if(filterFittingsByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textDiametr: string = filterFittingsByDistrict[0].nominalDiametr.toString();
      const textLength: string = filterFittingsByDistrict[0].length.toString()
      const textQuantity: string = filterFittingsByDistrict[0].quantity.toString()
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterFittingsByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterFittingsByDistrict.length
        },
        { size: 10, text: textDiametr },
        { size: 20, text: filterFittingsByDistrict[0].type },
        { size: 20, text: filterFittingsByDistrict[0].capacityValue },
        { size: 10, text:  textLength },
        { size: 10, text: textQuantity }
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterFittingsByDistrict.length; j++){
        const textDiametr: string = filterFittingsByDistrict[j].nominalDiametr.toString();
        const textLength: string = filterFittingsByDistrict[j].length.toString()
        const textQuantity: string = filterFittingsByDistrict[j].quantity.toString()
         const dataOtherRow: ICell[] = [
          { size: 10, text: textDiametr },
          { size: 20, text: filterFittingsByDistrict[j].type },
          { size: 20, text: filterFittingsByDistrict[j].capacityValue },
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
    this._el.filterByPipeLine(this._el.plugs, i).length +
    this._el.filterByPipeLine(this._el.offsets, i).length +
    this._el.filterByPipeLine(this._el.reducers, i).length +
    this._el.filterByPipeLine(this._el.tees, i).length +
    this._el.filterByPipeLine(this._el.equipments, i).length;

    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
