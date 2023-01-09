import { ValidService } from './../../services/valid.service';
import { ReportGuard } from 'src/app/guards/report.guard';
import { ElementsService } from './../../services/elements.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Pipe } from '../../interfaces/pipe.inteerface';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-pipe',
  templateUrl: './pipe.component.html',
  styleUrls: ['../../styles/form.scss']
})
export class PipeComponent implements OnInit, OnDestroy{
  public form: FormGroup = this._fb.group({
    pipe: this._fb.array([])
  });

  public formArray: FormArray = this.form.controls["pipe"] as FormArray;

  public quantityElementsForAdd: number | string = "";

  private _dataInLS!: Pipe[];

  private _subscription?: Subscription;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _el: ElementsService,
    private readonly _guard: ReportGuard,
    private readonly _valid: ValidService
    ){};

  ngOnInit(): void {
    this._dataInLS = this._el.pipes;

    if(this._dataInLS){
      for (let i = 0; i < this._dataInLS.length; i++){
        this.formArray.push(
          this._fb.group({
            numberPipeline: [this._dataInLS[i].numberPipeline, Validators.required],
            numberDistrict: [this._dataInLS[i].numberDistrict, Validators.required],
            nominalDiametr: [this._dataInLS[i].nominalDiametr, Validators.required],
            length: [this._dataInLS[i].length, Validators.required],
            diametr: [this._dataInLS[i].diametr, Validators.required],
            thickness: [this._dataInLS[i].thickness, Validators.required]
          })
        );
      };
    };

    this._validates();
  };

  private _validates(): void{
    this._guard.isValidPipe.isValid = this.form.valid;

    this._guard.isValidPipe.missingData =
    this._valid.findMissingDataInPipe();

    this._subscription = this.form.valueChanges.
    pipe(debounceTime(200)).
    subscribe(()=>{
      this._guard.isValidPipe.isValid = this.form.valid;

      this._guard.isValidPipe.missingData =
      this._valid.findMissingDataInPipe();
    });
  };

  public addNewElements(): void{
    for (let i = 0; i < this.quantityElementsForAdd; i++){
      this.formArray.push(
        this._fb.group({
          numberPipeline: ['', Validators.required],
          numberDistrict: ['', Validators.required],
          nominalDiametr: ['', Validators.required],
          length: ['', Validators.required],
          diametr: ['', Validators.required],
          thickness: ['', Validators.required]
        })
       );
    };
    this.quantityElementsForAdd = "";
  };

  public deleteElement(i: number): void{
    this.formArray.removeAt(i);
  };

  public addNewElement(i: number): void{
    this.formArray.insert( i + 1, this._fb.group({
      numberPipeline: [this.formArray.value[i].numberPipeline, Validators.required],
      numberDistrict: [this.formArray.value[i].numberDistrict, Validators.required],
      nominalDiametr: [this.formArray.value[i].nominalDiametr, Validators.required],
      length: ['', Validators.required],
      diametr: [this.formArray.value[i].diametr, Validators.required],
      thickness: [this.formArray.value[i].thickness, Validators.required]
      })
    );
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe()
  };
};
