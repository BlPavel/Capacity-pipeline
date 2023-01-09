import { GraduationByPipeLine } from './../../../interfaces/graduation-pipeline.interface';
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
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class GraduationPipelineListService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _store: StoreService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(): any[]{
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
        ...this._createHeaderGraduationList(),
        this._createTableGraduation(),
        ...this._signatures.create(false)
      ]
    }];
    return sections;
  };

  private _createHeaderGraduationList(): Paragraph[]{
    const place: string = this._el.commonData.place;
    const namePipeLine: string = this._el.commonData.name;
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: `Градуировочная таблица технологического нефтепродукта`,
          bold: true,
        })
      ]
    });
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: namePipeLine,
          underline:{
            color: "000000",
          }
        })
      ]
    });
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: `Организация (предприятие) ${place}`,
        })
      ]
    });
    return [paragraph1, paragraph2, paragraph3];
  };

  private _createTableGraduation(): Table{
    return this._table.createTable(
      this._createTableGraduationHead(),
      this._createTableGraduationBody());
  };

  private _createTableGraduationHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      {
        size: 70,
        text: "Отдельный трубопровод",
        columnSpan: 4
      },
      {
        size: 30,
        text: "Технологический трубопровод",
        columnSpan: 2
      }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 30, text: "Границы по градуировочным точкам" },
      { size: 15, text: "Длина, м" },
      { size: 15, text: "Вместимость, м3" },
      { size: 15, text: "Длина с нарастающим итогом, м" },
      { size: 15, text: "Вместимость с нарастающим итогом, м3" },
    ];
    const dataThirdRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 30, text: "2" },
      { size: 15, text: "3" },
      { size: 15, text: "4" },
      { size: 15, text: "5" },
      { size: 15, text: "6" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow));
    tableHead.push(this._table.createHead(dataSecondRow));
    tableHead.push(this._table.createHead(dataThirdRow));
    return tableHead;
  };

  private _createTableGraduationBody(): TableRow[]{
    let tableBody: TableRow[] = [];
    const graduationPipeLine: GraduationByPipeLine[] =
    this._store.graduationPipeLine;

    for(let i = 0; i < graduationPipeLine.length; i++){
      const nameBorder: string = graduationPipeLine[i].nameBorder;
      const length: string = graduationPipeLine[i].length.toString();
      const capacity: string = graduationPipeLine[i].capacity.toString();
      const lengthCumulative: string = graduationPipeLine[i].
      lengthCumulative.toString();
      const capacityCumulative: string = graduationPipeLine[i].
      capacityCumulative.toString();

      const dataRow: ICell[] = [
        { size: 10,  text: (i + 1).toString() },
        { size: 30, text: nameBorder },
        { size: 15, text: length },
        { size: 15, text: capacity },
        { size: 15, text: lengthCumulative },
        { size: 15, text: capacityCumulative },
      ];
      tableBody.push(this._table.createBody(dataRow));
    };
    return tableBody;
  };
};
