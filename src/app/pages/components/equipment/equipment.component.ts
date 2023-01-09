import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { ReportGuard } from 'src/app/guards/report.guard';
import { Equipment } from '../../interfaces/equipment.interfaces';
import { ElementsService } from '../../services/elements.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['../../styles/form.scss']
})
export class EquipmentComponent implements OnInit, OnDestroy {
  public form: FormGroup = this._fb.group({
    equipment: this._fb.array([])
  });

  public formArray: FormArray = this.form.controls["equipment"] as FormArray;

  public quantityElementsForAdd: number | string = "";

  private _dataInLS!: Equipment[];

  private _subscription?: Subscription;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _el: ElementsService,
    private readonly _guard: ReportGuard
    ){};

  ngOnInit(): void {
    this._dataInLS = this._el.equipments;

    if(this._dataInLS){
      for (let i = 0; i < this._dataInLS.length; i++){
        this.formArray.push(
          this._fb.group({
            numberPipeline: [this._dataInLS[i].numberPipeline, Validators.required],
            numberDistrict: [this._dataInLS[i].numberDistrict, Validators.required],
            nominalDiametr: [this._dataInLS[i].nominalDiametr, Validators.required],
            name: [this._dataInLS[i].name, Validators.required],
            capacity: [this._dataInLS[i].capacity, Validators.required],
            quantity: [this._dataInLS[i].quantity, Validators.required],
          })
        );
      };
    };

    this._validates();
  };

  private _validates(): void{
    this._guard.isValidEquipment = this.form.valid;
    this._subscription = this.form.valueChanges.
    pipe(debounceTime(200)).
    subscribe(()=>{
      this._guard.isValidEquipment = this.form.valid;
    });
  };

  public addNewElements(): void{
    for (let i = 0; i < this.quantityElementsForAdd; i++){
      this.formArray.push(
        this._fb.group({
          numberPipeline: ["", Validators.required],
          numberDistrict: ["", Validators.required],
          nominalDiametr: ["", Validators.required],
          name: ["", Validators.required],
          capacity: ["", Validators.required],
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
        name: ["", Validators.required],
        capacity: ["", Validators.required],
        quantity: ["", Validators.required],
      })
    );
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  };
};
