import { SignaturesService } from './../signatures.service';
import { GraduationByDistrict } from './../../../interfaces/graduation-district.interface';
import { StoreService } from './../../store.service';
import { ICell } from '../../../interfaces/cell.interface';
import { ElementsService } from '../../elements.service';
import { TableService } from '../table.service';
import { Injectable } from '@angular/core';
import {
  PageOrientation,
  Table,
  TableRow,
  Paragraph,
  AlignmentType,
  TextRun
} from 'docx';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';

@Injectable({ providedIn: 'root' })
export class GraduationDistrictListService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _store: StoreService,
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
        this._createHeaderGraduationList(i),
        this._createTableGraduation(i),
        ...this._signatures.create(false)
      ]
    }];
    return sections;
  };

  private _createHeaderGraduationList(i: number): Paragraph{
    const paragraph = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: `Градуировочная таблица отдельного трубопровода номер ${i + 1}`,
          bold: true,
        })
      ]
    });
    return paragraph;
  };

  private _createTableGraduation(i: number): Table{
    return this._table.createTable(
      this._createTableGraduationHead(),
      this._createTableGraduationBody(i));
  };

  private _createTableGraduationHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      {
        size: 10,
        text: "Номер участка",
        rowSpan: 2
      },
      {
        size: 30,
        text: "Границы участка по градуировочным точкам",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Длина участка, м",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Вместимость участка, м3",
        rowSpan: 2
      },
      {
        size: 40,
        text: "Трубопровод",
        columnSpan: 2
      }
    ];
    const dataSecondRow: ICell[] = [
      { size: 20, text: "длина с нарастающим итогом, м" },
      { size: 20, text: "вместимость с нарастающим итогом, м3" },
    ];
    const dataThirdRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 30, text: "2" },
      { size: 10, text: "3" },
      { size: 10, text: "4" },
      { size: 20, text: "5" },
      { size: 20, text: "6" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow));
    tableHead.push(this._table.createHead(dataSecondRow));
    tableHead.push(this._table.createHead(dataThirdRow));
    return tableHead;
  };

  private _createTableGraduationBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);
    const graduation: GraduationByDistrict[] = this._store.graduationDistrict[i];

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterGraduationByDistrict: GraduationByDistrict[] = graduation.filter(
        item => { return item.numberDistrict === k + 1 }
      );

      const nameDistrict: string = filterGraduationByDistrict[0].nameDistrict;
      const length: string = filterGraduationByDistrict[0].length.toString();
      const capacity: string = filterGraduationByDistrict[0].capacity.toString();
      const lengthCumulative: string = filterGraduationByDistrict[0].lengthCumulative.toString();
      const capacityCumulative: string = filterGraduationByDistrict[0].capacityCumulative.toString();
      const dataRow: ICell[] = [
        { size: 10,  text: (k + 1).toString() },
        { size: 30, text: nameDistrict },
        { size: 10, text: length },
        { size: 10, text: capacity },
        { size: 20, text: lengthCumulative },
        { size: 20, text: capacityCumulative },
      ];
      tableBody.push(this._table.createBody(dataRow));
    };
    return tableBody;
  };
};
