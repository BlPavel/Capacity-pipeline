import { Injectable } from '@angular/core';
import { ElementsService } from '../../elements.service';
import { ItemService } from '../item.service';
import { TableService } from '../table.service';
import { PageOrientation, Table, TableRow } from 'docx';
import { ICell } from '../../../interfaces/cell.interface';
import { SectionBoundary } from '../../../interfaces/section-boundary.interface';
import { TeeListService } from './tee-list.service';
import { Equipment } from '../../../interfaces/equipment.interfaces';
import { SignaturesService } from '../signatures.service';


@Injectable({ providedIn: 'root' })
export class EquipmentListService {
  constructor(
    private readonly _item: ItemService,
    private readonly _el: ElementsService,
    private readonly _table: TableService,
    private readonly _teeList: TeeListService,
    private readonly _signatures: SignaturesService
  ){};

  public createList(i: number): any[] | []{
    if(this._el.filterByPipeLine(this._el.equipments, i).length === 0){
      return []
    } else{
      const textItem: string = `5.${this._setNumberItem(i)} Вместимость оборудования`;
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
          this._createTableEquipment(i),
          ...this._signatures.create()
        ]
      }];
      return sections;
    };
  };

  private _setNumberItem(i: number): number{
    const numberItem: number =  this._el.filterByPipeLine(
      this._el.equipments, i).length === 0 ?
      this._teeList.setNumberItem(i) :
      this._teeList.setNumberItem(i) + 1;
    return numberItem;
  };

  private _createTableEquipment(i: number): Table{
    return this._table.createTable(
      this._createTableEquipmentHead(),
      this._createTableEquipmentBody(i));
  };

  private _createTableEquipmentHead(): TableRow[]{
    let tableHead: TableRow[] = [];
    const dataFirstRow: ICell[] = [
      { size: 10, text: "Номер участка" },
      { size: 20,text: "Границы участка по градуировочным точкам", },
      { size: 40,text: "Наименование", },
      { size: 10,text: "Условный проход, мм", },
      { size: 10,text: "Вместимость, м3", },
      { size: 10,text: "Количество" }
    ];
    const dataSecondRow: ICell[] = [
      { size: 10, text: "1" },
      { size: 20, text: "2" },
      { size: 40, text: "3" },
      { size: 10, text: "4" },
      { size: 10, text: "5" },
      { size: 10, text: "6" },
    ];
    tableHead.push(this._table.createHead(dataFirstRow, 20));
    tableHead.push(this._table.createHead(dataSecondRow, 20));
    return tableHead;
  };

  private _createTableEquipmentBody(i: number): TableRow[]{
    let tableBody: TableRow[] = [];
    const filterEquipmentsByPipeLine: Equipment[] = this._el.filterByPipeLine(
      this._el.equipments, i);
    const filterSectionBoundarysByPipeLine: SectionBoundary[] =
    this._el.filterByPipeLine(this._el.sectionBoundarys, i);

    for(let k = 0; k < filterSectionBoundarysByPipeLine.length; k++){
      const filterEquipmentsByDistrict = this._el.filterByDistrict(
        filterEquipmentsByPipeLine, k);
      if(filterEquipmentsByDistrict.length === 0) continue;

      const filterSectionBoundarysByDistrict: SectionBoundary[] =
      this._el.filterByDistrict(filterSectionBoundarysByPipeLine, k);
      const textDistrict: string = filterSectionBoundarysByDistrict[0].numberDistrict.toString();
      const textDiametr: string = filterEquipmentsByDistrict[0].nominalDiametr.toString();
      const textCapacity: string = filterEquipmentsByDistrict[0].capacity.toString();
      const textQuantity: string = filterEquipmentsByDistrict[0].quantity.toString();
      const dataFirstRow: ICell[] = [
        {
          size: 10,
          text: textDistrict,
          rowSpan: filterEquipmentsByDistrict.length,
        },
        {
          size: 20,
          text: filterSectionBoundarysByDistrict[0].name,
          rowSpan: filterEquipmentsByDistrict.length
        },
        { size: 40, text: filterEquipmentsByDistrict[0].name },
        { size: 10, text: textDiametr },
        { size: 10, text: textCapacity },
        { size: 10, text: textQuantity },
      ];
      tableBody.push(this._table.createBody(dataFirstRow, 20));

      for(let j = 1; j < filterEquipmentsByDistrict.length; j++){
        const textDiametr: string = filterEquipmentsByDistrict[j].nominalDiametr.toString();
        const textCapacity: string = filterEquipmentsByDistrict[j].capacity.toString();
        const textQuantity: string = filterEquipmentsByDistrict[j].quantity.toString();
         const dataOtherRow: ICell[] = [
          { size: 40, text: filterEquipmentsByDistrict[j].name },
          { size: 10, text: textDiametr },
          { size: 10, text: textCapacity },
          { size: 10, text: textQuantity },
         ];
         tableBody.push(this._table.createBody(dataOtherRow, 20));
      };
    };
    return tableBody;
  };
}
