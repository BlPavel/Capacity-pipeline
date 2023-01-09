import { ValidService } from './../../services/valid.service';
import { debounceTime } from 'rxjs/operators';
import { ReportGuard } from './../../../guards/report.guard';
import { Subscription } from 'rxjs';
import { FileService } from './../../services/file.service';
import { FormService } from './../../services/form.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonData } from '../../interfaces/common-data.interface';
import { ElementsService } from '../../services/elements.service';

@Component({
  selector: 'app-common-data',
  templateUrl: './common-data.component.html',
  styleUrls: ['./common-data.component.scss', '../../styles/form.scss']
})
export class CommonDataComponent implements OnInit, OnDestroy {
  public form: FormGroup = this._fb.group({
    name: ["", Validators.required],
    date: ["", Validators.required],
    place: ["", Validators.required],
    interval: ["5", Validators.required],
    temperature: ["", Validators.required],
    positionHead: ["", Validators.required],
    nameHead: ["", Validators.required],
    positionChairman: ["", Validators.required],
    nameChairman: ["", Validators.required],
    nameMember1: ["", Validators.required],
    nameMember2: [""],
    nameMember3: [""],
    pipeLine: this._fb.array([
      this._fb.group({
        numberPipeLine: ["", Validators.required],
        namePipeLine: ["", Validators.required],
        nameBorder: ["", Validators.required],
      })
    ]),
    instruments: this._fb.array([
      this._fb.group({
        name: ["", Validators.required],
        certificate: ["", Validators.required]
      }),
    ])
  });

  private _dataInLS!: CommonData;

  public formArrayPipeLines: FormArray = this.form.controls["pipeLine"] as FormArray;

  public formArrayInstruments: FormArray = this.form.controls["instruments"] as FormArray;

  private _subscription?: Subscription;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _formService: FormService,
    private readonly _file: FileService,
    private readonly _guard: ReportGuard,
    private readonly _el: ElementsService,
    private readonly _valid: ValidService
    ){};

  ngOnInit(): void {
    this._dataInLS = this._el.commonData;

    if(this._dataInLS){
      this.form = this._formService.recoverFormCommonData(this._el.commonData);
      this.formArrayPipeLines = this.form.controls["pipeLine"] as FormArray;
      this.formArrayInstruments = this.form.controls["instruments"] as FormArray;
    };

    this.__validates();
  };

  private __validates(): void {
    this._guard.isValidCommonData.isValid = this.form.valid;

    this._guard.isValidCommonData.hasRepeat =
    this._valid.checkedHasRepeatInCommon();

    this._subscription = this.form.valueChanges.
    pipe(debounceTime(200)).
    subscribe(()=>{
      this._guard.isValidCommonData.isValid = this.form.valid;

      this._guard.isValidCommonData.hasRepeat =
      this._valid.checkedHasRepeatInCommon();
    });
  }

  public deleteElementPipeLine(i: number): void{
    this.formArrayPipeLines.removeAt(i);
  };

  public deleteElementInstrument(i: number): void{
    this.formArrayInstruments.removeAt(i);
  };

  public addNewElementPipeLine(i: number): void{
    this.formArrayPipeLines.insert( i + 1, this._fb.group({
        numberPipeLine: [+this.formArrayPipeLines.value[i].numberPipeLine + 1, Validators.required],
        namePipeLine: ["", Validators.required],

      })
    );
  };

  public addNewElementInstrument(i: number): void{
    this.formArrayInstruments.insert( i + 1, this._fb.group({
        name: ["", Validators.required],
        certificate: ["", Validators.required]
      })
    );
  };

  public clear():void{
    const isClear: boolean = confirm("Вы действительно хотите очистить все формы?");
    if(isClear){
      this._formService.clear();
      this.form.reset();
      this.formArrayPipeLines = this._fb.array([
        this._fb.group({
          numberPipeLine: ["", Validators.required],
          namePipeLine: ["", Validators.required],
          nameBorder: ["", Validators.required],
        })
      ]);
      this.formArrayInstruments = this._fb.array([
        this._fb.group({
          name: ["", Validators.required],
          certificate: ["", Validators.required]
        }),
      ]);
    };
  };

  public unload(event: any): void{
    this._file.unload(event);
    setTimeout(()=>{
        this._dataInLS = this._el.commonData;
        this.form = this._formService.recoverFormCommonData(this._dataInLS)
        this.formArrayPipeLines = this.form.controls["pipeLine"] as FormArray;
        this.formArrayInstruments = this.form.controls["instruments"] as FormArray;
      }, 200);
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  };
};
