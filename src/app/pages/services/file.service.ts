import { ReportGuard } from 'src/app/guards/report.guard';
import { Injectable } from '@angular/core';
import { ElementsService } from './elements.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _LS: LocalStorageService,
    private readonly _guard: ReportGuard
    ){};

  public save(): void{
    const nameFile: string = this._el.commonData.name;
    const text: any[] = [
      this._el.commonData,
      this._el.sectionBoundarys,
      this._el.pipes,
      this._el.offsets,
      this._el.reducers,
      this._el.tees,
      this._el.plugs,
      this._el.fittings,
      this._el.equipments
    ];
    const textToJson: string = JSON.stringify(text)
    let myData: string = 'data:application/txt;charset=utf-8,' +
    encodeURIComponent(textToJson);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = myData;
    a.download = `${nameFile}.txt`;
    a.click()
  };

  public unload(event: any): void{
    const reader: FileReader = new FileReader();
    const file: File = event.files[0];
    reader.readAsText(file);
    reader.onload = ()=>{
      if(typeof(reader.result) === "string"){
        const JSONReader: any[] = JSON.parse(reader.result);
        this._saveInLocalStorage(JSONReader);
        this._updateGuard();
      };
    };
  };

  private _saveInLocalStorage(JSONReader: any[]){
    const sectionBoundary: {} = {sectionBoundary: JSONReader[1]};
    const pipe: {} = {pipe: JSONReader[2]};
    const offset: {} = {offset: JSONReader[3]};
    const reducer: {} = {reducer: JSONReader[4]};
    const tee: {} = {tee: JSONReader[5]};
    const plug: {} = {plug: JSONReader[6]};
    const fitting: {} = {fitting: JSONReader[7]};
    const equipment: {} = {equipment: JSONReader[8]};

    this._LS.set('commonData', JSONReader[0]);
    this._LS.set('sectionBoundary', sectionBoundary);
    this._LS.set('pipe', pipe);
    this._LS.set('offset', offset);
    this._LS.set('reducer', reducer);
    this._LS.set('tee', tee);
    this._LS.set('plug', plug);
    this._LS.set('fitting', fitting);
    this._LS.set('equipment', equipment);
  };

  private _updateGuard(): void{
    this._guard.isValidCommonData = {
      isValid: true,
      hasRepeat: false
    };
    this._guard.isValidSectionBoundary = {
      isValid: true,
      hasAllPipeLine: true,
      hasRepeat: false
    };
    this._guard.isValidPipe = {
      isValid: true,
      missingData: ''
    };
    this._guard.isValidOffset = true;
    this._guard.isValidReducer = true;
    this._guard.isValidTee = true;
    this._guard.isValidPlug = true;
    this._guard.isValidFitting = true;
    this._guard.isValidEquipment = true;
  };
};
