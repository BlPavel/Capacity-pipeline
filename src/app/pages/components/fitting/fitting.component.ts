import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { ReportGuard } from 'src/app/guards/report.guard';
import { Fitting } from '../../interfaces/fitting.interface';
import { ElementsService } from '../../services/elements.service';

@Component({
  selector: 'app-fitting',
  templateUrl: './fitting.component.html',
  styleUrls: ['../../styles/form.scss']
})
export class FittingComponent implements OnInit, OnDestroy {
  public form: FormGroup = this._fb.group({
    fitting: this._fb.array([])
  });

  public formArray: FormArray = this.form.controls["fitting"] as FormArray;

  public quantityElementsForAdd: number | string = "";

  private _dataInLS!: Fitting[];

  private _subscription?: Subscription;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _el: ElementsService,
    private readonly _guard: ReportGuard
    ){};

  ngOnInit(): void {
    this._dataInLS = this._el.fittings;

    if(this._dataInLS){
      for (let i = 0; i < this._dataInLS.length; i++){
        this.formArray.push(
          this._fb.group({
            numberPipeline: [this._dataInLS[i].numberPipeline, Validators.required],
            numberDistrict: [this._dataInLS[i].numberDistrict, Validators.required],
            nominalDiametr: [this._dataInLS[i].nominalDiametr, Validators.required],
            length: [this._dataInLS[i].length, Validators.required],
            type: [this._dataInLS[i].type, Validators.required],
            capacityValue: [this._dataInLS[i].capacityValue, Validators.required],
            quantity: [this._dataInLS[i].quantity, Validators.required],
          })
        );
      };
    };

    this._validates();
  };

  private _validates(): void{
    this._guard.isValidFitting = this.form.valid;
    this._subscription = this.form.valueChanges.
    pipe(debounceTime(200)).
    subscribe(()=>{
      this._guard.isValidFitting = this.form.valid;
    });
  };

  public addNewElements(): void{
    for (let i = 0; i < this.quantityElementsForAdd; i++){
      this.formArray.push(
        this._fb.group({
          numberPipeline: ["", Validators.required],
          numberDistrict: ["", Validators.required],
          nominalDiametr: ["", Validators.required],
          length: ["", Validators.required],
          type: ["Задвижка", Validators.required],
          capacityValue: ["Полная", Validators.required],
          quantity: ["", Validators.required],
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
        nominalDiametr: ["", Validators.required],
        length: ["", Validators.required],
        type: ["Задвижка", Validators.required],
        capacityValue: ["Полная", Validators.required],
        quantity: ["", Validators.required],
      })
    );
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  };
};
