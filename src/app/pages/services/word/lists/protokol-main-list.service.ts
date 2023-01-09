import { ElementsService } from '../../elements.service';
import { TableService } from '../table.service';
import { ItemService } from '../item.service';
import { Injectable } from '@angular/core';
import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow } from "docx";
import { ICell } from '../../../interfaces/cell.interface';

@Injectable({ providedIn: 'root' })
export class ProtokolMainListService {

  constructor(
    private readonly _item: ItemService,
    private readonly _table: TableService,
    private readonly _el: ElementsService
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
        },
      },
      children: [
        ...this._createHeaderMainProtokol(i),
        this._item.create('1. Используемые средства измерений'),
        this._createTableInstruments(),
        this._item.create('2. Условия проведения измерений'),
        this._createTableWeatherConditions(),
        this._item.create('3. Границы участков по граничным точкам'),
        this._createTableSeparation(i)
      ]
    }];
    return sections;
  };

  private _createHeaderMainProtokol(i: number): Paragraph[]{
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.CENTER,
      style: "standartStyle",
      children:[
        new TextRun({
          text: 'Протокол измерений размеров участков отдельного трубопровода',
          bold: true
        })
      ]
    })
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.CENTER,
      style: "standartStyle",
      spacing:{
        before: 100,
        after: 100
      },
      children:[
        new TextRun({
          text: this._el.namePipeLines[i],
          underline:{
            color: "000000",
          }
        })
      ]
    });
    return [paragraph1, paragraph2];
  };

  private _createTableInstruments(): Table{
    const dataHead: ICell[] = [
      {
        size: 20,
        text: "№п/п"
      },
      {
        size: 40,
        text: "Наименование, тип средства измерений"
      },
      {
        size: 40,
        text: "Номер, дата свидетельства о поверке"
      }
    ];
    const tableHead: TableRow = this._table.createHead(dataHead);
    return this._table.createTable(
      [tableHead],
      this._createTableInstrumentsBody());
  };

  private _createTableInstrumentsBody(): TableRow[]{
    let tableBody: TableRow[] = [];
    for (let i = 0; i < this._el.commonData.instruments.length; i++){
      const dataRow: ICell[]  = [
        {
          size: 20,
          text: (i + 1).toString()
        },
        {
          size: 40,
          text: this._el.commonData.instruments[i].name
        },
        {
          size: 40,
          text: this._el.commonData.instruments[i].certificate
        },
      ]
      tableBody.push(this._table.createBody(dataRow))
    };
    return tableBody;
  };

  private _createTableWeatherConditions(): Table{
    const dataHead: ICell[] = [
      {
        size: 30,
        text: "Температура окружающего воздуха"
      },
      {
        size: 30,
        text: "Состояние погоды"
      },
      {
        size: 40,
        text: "Температура поверхности трубопровода (при измерении толщины стенки толщиномером)"
      }
    ];
    const tableHead: TableRow = this._table.createHead(dataHead);

    const dataBody: ICell[] = [
      {
        size: 30,
        text: this._el.commonData.temperature.toString()
      },
      {
        size: 30,
        text: "без осадков"
      },
      {
        size: 40,
        text: this._el.commonData.temperature.toString()
      }
    ];
    const tableBody: TableRow = this._table.createBody(dataBody)
    return this._table.createTable(
      [tableHead],
      [tableBody]);
  };

  private _createTableSeparation(i: number): Table{
    const dataHead: ICell[] = [
      {
        size: 30,
        text: "Номера участков"
      },
      {
        size: 70,
        text: "Границы участка по граничным точкам"
      },
    ];
    const tableHead = this._table.createHead(dataHead);
    return this._table.createTable(
      [tableHead],
      this._table.createRowsInSeparationTable(i));
  };
};
