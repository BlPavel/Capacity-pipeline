import { ElementsService } from '../../elements.service';
import { ICell } from '../../../interfaces/cell.interface';
import { TableService } from '../table.service';
import { Injectable } from '@angular/core';
import { Paragraph, TextRun, AlignmentType, Table, TableRow,} from "docx";
import { SignaturesService } from '../signatures.service';

@Injectable({ providedIn: 'root' })
export class SeparationListService {
  constructor(
    private readonly _el: ElementsService,
    private readonly _table: TableService,
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
        },
      },
      children: [
        ...this._createHeaderSeparationList(),
        this._createTableSeparation(),
        ...this._signatures.create()
      ]
    }];
    return sections;
  };

  private _createHeaderSeparationList(): Paragraph[]{
    const namePipeLine: string = this._el.commonData.name
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "Таблица разделения",
          bold: true
        })
      ]
    });
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "технологического трубопровода",
          bold: true
        })
      ]
    });
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 100
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
    const paragraph4 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "на отдельные трубопроводы и участки",
          bold: true
        })
      ]
    });
    return[paragraph1, paragraph2, paragraph3, paragraph4];
  };

  private _createTableSeparation(): Table{
    const dataHead: ICell[] = [
      {
        size: 30,
        text: "Номера участков"
      },
      {
        size: 70,
        text: "Номера задвижек, границы"
      },
    ];
    const tableHead = this._table.createHead(dataHead);

    return this._table.createTable(
      [tableHead],
      this._createTableSeparationBody()
      );
  };

  private _createTableSeparationBody(){
    const namePipeLines: string[] = this._el.namePipeLines;
    let tableBody: TableRow[] = [];

    for (let i = 0; i < namePipeLines.length;i++){
      const dataRow: ICell[] = [{
        size: 100,
        text: namePipeLines[i],
        columnSpan: 2
      }];
      tableBody.push(this._table.createBody(dataRow));
      tableBody.push(...this._table.createRowsInSeparationTable(i))
    };
    return tableBody;
  };
};

