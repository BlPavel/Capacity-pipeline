import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow, Paragraph } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { ReducerListService } from './reducer-list.service';
import { Tee } from '../../../interfaces/tee.interface';
import { SignaturesService } from '../signatures.service';


@Injectable({ providedIn: 'root' })
export class TeeListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _reducerList: ReducerListService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.tees, i).length === 0){
      return []
    } else{
      const textItem: string = `5.${this.setNumberItem(i)} Параметры фитинга (тройники)`;
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
          this._createTableTee(i),
          ...this._createSignatures(i)
        ]
      }];
      return sections;
    };
  };

  public setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.tees, i).length === 0 ?
      this._reducerList.setNumberItem(i) :
      this._reducerList.setNumberItem(i) + 1;
    return numberItem;
  };

  private _createTableTee(i: number): Table{
    return this._table.createTable(
      this._createTableTeeHead(),
      this._createTableTeeBody(i));
  };

  private _createTableTeeHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 20,text: "Тип тройника", },
      { size: 10,text: "Условный проход, мм, Dy", },
      { size: 10,text: "Строительная длина, мм, Ly", },
      { size: 10,text: "Условный проход, мм, dx", },
      { size: 10,text: "Строительная длина, мм, lx", },
      { size: 10,text: "Количество" }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 20, text: "2" },
      { size: 20, text: "3" },
      { size: 10, text: "4" },
      { size: 10, text: "5" },
      { size: 10, text: "6" },
      { size: 10, text: "7" },
      { size: 10, text: "8" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    return tableHead;
  };

  private _createTableTeeBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterTeesByPipeLine: Tee[] = this._el.filterByPipeLine(
      this._el.tees, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterTeesByDistrict = this._el.filterByDistrict(
        filterTeesByPipeLine, k);
      if(filterTeesByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textType: string = filterTeesByDistrict[0].nominalDiametr ===
      filterTeesByDistrict[0].diametrBranch ?
      'Равнопроходный' : 'Переходной';
      const textDiametr: string = filterTeesByDistrict[0].nominalDiametr.toString();
      const textLength: string = filterTeesByDistrict[0].length.toString();
      const textDiametrBranch: string = filterTeesByDistrict[0].diametrBranch.toString();
      const textLengthBranch: string = filterTeesByDistrict[0].lengthBranch.toString();
      const textQuantity: string = filterTeesByDistrict[0].quantity.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterTeesByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterTeesByDistrict.length
        },
        { size: 20, text: textType },
        { size: 10, text: textDiametr },
        { size: 10, text: textLength },
        { size: 10, text: textDiametrBranch },
        { size: 10, text: textLengthBranch },
        { size: 10, text: textQuantity },
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterTeesByDistrict.length; j++){
        const textType: string = filterTeesByDistrict[j].nominalDiametr ===
        filterTeesByDistrict[j].diametrBranch ?
        'Равнопроходный' : 'Переходной';
        const textDiametr: string = filterTeesByDistrict[j].nominalDiametr.toString();
        const textLength: string = filterTeesByDistrict[j].length.toString();
        const textDiametrBranch: string = filterTeesByDistrict[j].diametrBranch.toString();
        const textLengthBranch: string = filterTeesByDistrict[j].lengthBranch.toString();
        const textQuantity: string = filterTeesByDistrict[j].quantity.toString();
         const dataOtherRow: ICell[] = [
          { size: 20, text: textType },
          { size: 10, text: textDiametr },
          { size: 10, text: textLength },
          { size: 10, text: textDiametrBranch },
          { size: 10, text: textLengthBranch },
          { size: 10, text: textQuantity },
         ];
         tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };

  private _createSignatures(i: number): Paragraph[] | []{
    const quantityNextList: number = this._el.filterByPipeLine(
      this._el.equipments, i).length;
    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
