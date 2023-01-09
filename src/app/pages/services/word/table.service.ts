import { LocalStorageService } from './../local-storage.service';
import { Injectable } from '@angular/core';
import {
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  WidthType } from "docx";
import { ICell } from '../../interfaces/cell.interface';
import { SectionBoundary } from '../../interfaces/section-boundary.interface';
import { ElementsService } from '../elements.service';

@Injectable({ providedIn: 'root' })
export class TableService {

  constructor(private readonly _el: ElementsService){};

  public createTable(head: TableRow[], body: TableRow[]): Table{
    const table = new Table({
      width:{
        type: WidthType.PERCENTAGE,
        size: 100
      },
      margins:{
        top: 40,
        left: 40,
        right: 40,
        bottom:40
      },
      rows:[...head, ...body]
    });
    return table;
  };

  public createHead(data: ICell[], size?: number): TableRow{
    const tableRow: TableRow = new TableRow({
      tableHeader: true,
      children:[...this._createHeadCell(data, size)]
    });
    return tableRow;
  };

  private _createHeadCell(data: ICell[], size?: number): TableCell[]{
    const result = []
    for (let i = 0; i < data.length; i++){
      const cell = new TableCell({
        width:{
          type: WidthType.PERCENTAGE,
          size: data[i].size
        },
        columnSpan: data[i].columnSpan || 1,
        rowSpan: data[i].rowSpan || 1,
        verticalAlign: VerticalAlign.CENTER,
        children:[
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "standartStyle",
            children:[
              new TextRun({
                text: data[i].text,
                bold: true,
                size: size || 24
              })
            ]
          })
        ]
      })
      result.push(cell)
    };
    return result;
  };

  public createBody(data: ICell[], size?: number): TableRow{
    const tableRow: TableRow = new TableRow({
      children:[...this._createBodyCell(data, size)]
    })
    return tableRow;
  };

  private _createBodyCell(data: ICell[], size?: number): TableCell[]{
    const result = []
    for (let i = 0; i < data.length; i++){
      const cell = new TableCell({
        width:{
          type: WidthType.PERCENTAGE,
          size: data[i].size
        },
        columnSpan: data[i].columnSpan || 1,
        rowSpan: data[i].rowSpan || 1,
        verticalAlign: VerticalAlign.CENTER,
        children:[
          new Paragraph({
            alignment: AlignmentType.CENTER,
            style: "standartStyle",
            children:[
              new TextRun({
                text: data[i].text,
                size: size || 24
              })
            ]
          })
        ]
      })
      result.push(cell);
    };
    return result;
  };

  public createRowsInSeparationTable(i: number){
    const filterSectionBoundary: SectionBoundary[] = this._el.sectionBoundarys.filter(
      ( item ) => {
        return item.numberPipeline === i + 1
      });
    let rows: TableRow[] = [];

    for (let k = 0; k < filterSectionBoundary.length; k++){
      const dataRow: ICell[] = [
        {
          size: 30,
          text: filterSectionBoundary[k].numberDistrict.toString(),
        },
        {
          size: 70,
          text: filterSectionBoundary[k].name,
        },
      ];
      rows.push(this.createBody(dataRow));
    };
    return rows;
  };
};
