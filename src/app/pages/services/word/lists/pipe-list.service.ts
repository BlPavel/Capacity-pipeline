import { Paragraph } from 'docx';
import { SignaturesService } from '../signatures.service';
import { ICell } from '../../../interfaces/cell.interface';
import { ElementsService } from '../../elements.service';
import { TableService } from '../table.service';
import { ItemService } from '../item.service';
import { Injectable } from '@angular/core';
import { PageOrientation, Table, TableRow } from 'docx';
import { Pipe } from '../../../interfaces/pipe.inteerface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';

@Injectable({ providedIn: 'root' })
export class PipeListService {

  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[]{
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
        this._item.create('5. Результаты измерений'),
        this._item.create('5.1 Параметры прямолинейной трубы'),
        this._createTablePipe(i),
        ...this._createSignatures(i)
      ]
    }];
    return sections;
  };

  private _createTablePipe(i: number): Table{
    return this._table.createTable(
      this._createTablePipeHead(),
      this._createTablePipeBody(i));
  };

  private _createTablePipeHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      {
        size: 5,
        text: "Номер участка",
        rowSpan: 2
      },
      {
        size: 5,
        text: "Границы участка по градуировочным точкам",
        rowSpan: 2
      },
      {
        size: 40,
        text: "Диаметр наружный, мм, под номером измерений",
        columnSpan: 8
      },
      {
        size: 20,
        text: "Длина окружности, мм, под номером измерений",
        columnSpan: 4
      },
      {
        size: 20,
        text: "Толщина стенки, мм, под номером измерений",
        columnSpan: 4
      },
      {
        size: 10,
        text: "Длина, м, под номером измерений",
        columnSpan: 2
      }
    ];
    const dataSecondRow: ICell[] = [
      { size: 5, text: "1" },
      { size: 5, text: "2" },
      { size: 5,text: "3" },
      { size: 5,text: "4" },
      { size: 5,text: "5" },
      { size: 5,text: "6" },
      { size: 5,text: "7" },
      { size: 5,text: "8" },
      { size: 5,text: "1" },
      { size: 5,text: "2" },
      { size: 5,text: "3" },
      { size: 5,text: "4" },
      { size: 5,text: "1" },
      { size: 5,text: "2" },
      { size: 5,text: "3" },
      { size: 5,text: "4" },
      { size: 5,text: "1" },
      { size: 5,text: "2" },
    ];
    const dataThirdRow: ICell[] = [
      { size: 5, text: "1" },
      { size: 5, text: "2" },
      { size: 5, text: "3" },
      { size: 5, text: "4" },
      { size: 5,text: "5" },
      { size: 5,text: "6" },
      { size: 5,text: "7" },
      { size: 5,text: "8" },
      { size: 5,text: "9" },
      { size: 5,text: "10" },
      { size: 5,text: "11" },
      { size: 5,text: "12" },
      { size: 5,text: "13" },
      { size: 5,text: "14" },
      { size: 5,text: "15" },
      { size: 5,text: "16" },
      { size: 5,text: "17" },
      { size: 5,text: "18" },
      { size: 5,text: "19" },
      { size: 5,text: "20" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    tableHead.push(this._table.createHead(dataThirdRow, 20));
    return tableHead;
  };

  private _createTablePipeBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterPipesByPipeLine: Pipe[] = this._el.filterByPipeLine(
      this._el.pipes, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterPipesByDistrict = this._el.filterByDistrict(
        filterPipesByPipeLine, k);
      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);

      const textDiametr: string = filterPipesByDistrict[0].diametr.toString();
      const textThickness: string = filterPipesByDistrict[0].thickness.toString();
      const textLength = filterPipesByDistrict[0].length.toString();

      const dataFirstRow: ICell[] = [
        {
          size: 5,
          text: (i + 1).toString(),
          rowSpan: filterPipesByDistrict.length
        },
        {
          size: 5,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterPipesByDistrict.length
        },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: textDiametr },
        { size: 5, text: "-" },
        { size: 5, text: "-" },
        { size: 5, text: "-" },
        { size: 5, text: "-" },
        { size: 5, text: textThickness },
        { size: 5, text: textThickness },
        { size: 5, text: textThickness },
        { size: 5, text: textThickness },
        { size: 5, text: textLength },
        { size: 5, text: textLength },
      ]
      tableBody.push(this._table.createBody(dataFirstRow, 20))

      for (let j = 1; j < filterPipesByDistrict.length; j++){
        const textDiametr: string = filterPipesByDistrict[j].diametr.toString();
        const textThickness: string = filterPipesByDistrict[j].thickness.toString();
        const textLength = filterPipesByDistrict[j].length.toString();
        const dataOtherRow: ICell[] = [
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: textDiametr },
          { size: 5, text: "-" },
          { size: 5, text: "-" },
          { size: 5, text: "-" },
          { size: 5, text: "-" },
          { size: 5, text: textThickness },
          { size: 5, text: textThickness },
          { size: 5, text: textThickness },
          { size: 5, text: textThickness },
          { size: 5, text: textLength },
          { size: 5, text: textLength },
        ];
        tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };

  private _createSignatures(i: number): Paragraph[] | []{
    const quantityNextList: number =
    this._el.filterByPipeLine(this._el.fittings, i).length +
    this._el.filterByPipeLine(this._el.plugs, i).length +
    this._el.filterByPipeLine(this._el.offsets, i).length +
    this._el.filterByPipeLine(this._el.reducers, i).length +
    this._el.filterByPipeLine(this._el.tees, i).length +
    this._el.filterByPipeLine(this._el.equipments, i).length;

    if(quantityNextList) return [];
    else return this._signatures.create();
  };
};
