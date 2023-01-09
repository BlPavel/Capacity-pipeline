import { CommonData } from './../interfaces/common-data.interface';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormService {
  private _key: string[] = [
    'commonData',
    'sectionBoundary',
    'pipe',
    'offset',
    'reducer',
    'tee',
    'plug',
    'fitting',
    'equipment'];

  constructor(
    private readonly _LS: LocalStorageService,
    private readonly _fb: FormBuilder
    ) {};

  public clear(): void{
    for (let i = 0;  i < this._key.length; i++){
      this._LS.delete(this._key[i]);
    };
  };

  public recoverFormCommonData(dataInLS: CommonData): FormGroup{
    const form: FormGroup = this._fb.group({
      name: [dataInLS.name, Validators.required],
      date: [dataInLS.date, Validators.required],
      place: [dataInLS.place, Validators.required],
      interval: [dataInLS.interval, Validators.required],
      temperature: [dataInLS.temperature, Validators.required],
      positionHead: [dataInLS.positionHead, Validators.required],
      nameHead: [dataInLS.nameHead, Validators.required],
      positionChairman: [dataInLS.positionChairman, Validators.required],
      nameChairman: [dataInLS.nameChairman, Validators.required],
      nameMember1: [dataInLS.nameMember1, Validators.required],
      nameMember2: [dataInLS.nameMember2],
      nameMember3: [dataInLS.nameMember3],
      pipeLine: this._fb.array([]),
      instruments: this._fb.array([])
    });
    const pipeLines: FormArray = form.controls["pipeLine"] as FormArray;
    const instruments: FormArray = form.controls["instruments"] as FormArray;

    for (let i = 0; i < dataInLS.pipeLine.length; i++){
      pipeLines.push(
        this._fb.group({
          numberPipeLine: [dataInLS.pipeLine[i].numberPipeLine, Validators.required],
          namePipeLine: [dataInLS.pipeLine[i].namePipeLine, Validators.required],
          nameBorder: [dataInLS.pipeLine[i].nameBorder, Validators.required],
        })
      );
    };

    for (let i = 0; i < dataInLS.instruments.length; i++){
      instruments.push(
        this._fb.group({
          name: [dataInLS.instruments[i].name, Validators.required],
          certificate: [dataInLS.instruments[i].certificate, Validators.required]
        })
      )
    }
    return form;
  }
};
