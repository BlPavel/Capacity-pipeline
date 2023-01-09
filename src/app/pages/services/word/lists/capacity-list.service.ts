import { StoreService } from './../../store.service';
import { CapacityPipeLineService } from './../../capacity-pipeline.service';
import { CapacityPipeLine } from '../../../interfaces/capacity-pipeline.interface';
import { SignaturesService } from '../signatures.service';
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
export class CapacityListService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _signatures: SignaturesService,
    private readonly _store: StoreService
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
        this._createHeaderCapacityList(),
        this._createTableCapacity(i),
        ...this._signatures.create()
      ]
    }];
    return sections;
  };

  private _createHeaderCapacityList(): Paragraph{
    const paragraph = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "Вместимость технологического трубопровода",
          bold: true,
        })
      ]
    });
    return paragraph;
  };

  private _createTableCapacity(i: number): Table{
    return this._table.createTable(
      this._createTableCapacityHead(i),
      this._createTableCapacityBody(i));
  };

  private _createTableCapacityHead(i: number): TableRow[]{
    const namePipeline = this._el.commonData.pipeLine[i].namePipeLine;
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      {
        size: 5,
        text: "№ участка по схеме",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Границы участка",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Перечень составляющих частей по участкам трубопровода",
        rowSpan: 2
      },
      {
        size: 5,
        text: "Кол-во оборудов., деталей, армат.",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Длина трубопр., мм",
        rowSpan: 2
      },
      {
        size: 10,
        text: "Внутренний диаметр, мм",
        rowSpan: 2
      },
      {
        size: 50,
        text: "Вместимость, м3",
        columnSpan: 5
      },
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "Прямолинейной части" },
      { size: 10, text: "Криволинейной части" },
      { size: 10, text: "Оборудования, деталей, арматуры" },
      { size: 10, text: "Части участка трубопр." },
      { size: 10, text: "Участка трубопр." },
    ];
    const dataThirdRow: ICell[] = [
      { size: 5, text: "1" },
      { size: 10, text: "2" },
      { size: 10, text: "3" },
      { size: 5, text: "4" },
      { size: 10,text: "5" },
      { size: 10,text: "6" },
      { size: 10,text: "7" },
      { size: 10,text: "8" },
      { size: 10,text: "9" },
      { size: 10,text: "10" },
      { size: 10,text: "11" },
    ];
    const dataFourthRow :ICell[] = [
      {
        size: 100,
        text: namePipeline,
        columnSpan: 11
      }
    ]
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    tableHead.push(this._table.createHead(dataThirdRow, 20));
    tableHead.push(this._table.createHead(dataFourthRow, 20));
    return tableHead;
  };

  private _createTableCapacityBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);
    const capacity: CapacityPipeLine[] = this._store.capacityPipeLine[i];

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);

      const filterCapcityByDistrict: CapacityPipeLine[] = capacity.filter(item=>{
        return item.numberDistrict === k + 1
      })
      const quantityElements: string = filterCapcityByDistrict[0].quantityElements.toString();
      const nameElements: string = filterCapcityByDistrict[0].nameElements
      const length: string = filterCapcityByDistrict[0].lengthPipeLine.toString();
      const diametr: string = filterCapcityByDistrict[0].nominalDiametr.toString();
      const capacityPipe: string = filterCapcityByDistrict[0].capacity.pipe.toString();
      const capacityOffset: string = filterCapcityByDistrict[0].capacity.offset.toString();
      const capacityOther: string = filterCapcityByDistrict[0].capacity.other.toString();
      const capacityPart: string = filterCapcityByDistrict[0].capacityPart.toString();
      let capacityDistrict: string = filterCapcityByDistrict[0].capacityCumulative.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 5,
          text: (k + 1).toString(),
          rowSpan: filterCapcityByDistrict.length
        },
        {
          size: 10,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterCapcityByDistrict.length
        },
        { size: 10, text: nameElements },
        { size: 5, text: quantityElements },
        { size: 10, text: length },
        { size: 10, text: diametr },
        { size: 10, text: capacityPipe },
        { size: 10, text: capacityOffset },
        { size: 10, text: capacityOther },
        { size: 10, text: capacityPart },
        { size: 10, text: capacityDistrict },
      ]
      tableBody.push(this._table.createBody(dataFirstRow, 20))

      for(let j = 1; j < filterCapcityByDistrict.length; j++){
        const quantityElements: string = filterCapcityByDistrict[j].quantityElements.toString();
        const nameElements: string = filterCapcityByDistrict[j].nameElements
        const length: string = filterCapcityByDistrict[j].lengthPipeLine.toString();
        const diametr: string = filterCapcityByDistrict[j].nominalDiametr.toString();
        const capacityPipe: string = filterCapcityByDistrict[j].capacity.pipe.toString();
        const capacityOffset: string = filterCapcityByDistrict[j].capacity.offset.toString();
        const capacityOther: string = filterCapcityByDistrict[j].capacity.other.toString();
        const capacityPart: string = filterCapcityByDistrict[j].capacityPart.toString();
        const capacityDistrict: string = filterCapcityByDistrict[j].capacityCumulative.toString();
        const dataSecondRow: ICell[] = [
          { size: 10, text: nameElements },
          { size: 5, text: quantityElements },
          { size: 10, text: length },
          { size: 10, text: diametr },
          { size: 10, text: capacityPipe },
          { size: 10, text: capacityOffset },
          { size: 10, text: capacityOther },
          { size: 10, text: capacityPart },
          { size: 10, text: capacityDistrict },
        ]
        tableBody.push(this._table.createBody(dataSecondRow, 20))
      };
    };
    return tableBody;
  };
};
