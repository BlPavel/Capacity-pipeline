import { ValidService } from './../../services/valid.service';
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReportGuard } from 'src/app/guards/report.guard';
import { SectionBoundary } from '../../interfaces/section-boundary.interface';
import { ElementsService } from '../../services/elements.service';

@Component({
  selector: 'app-section-boundary',
  templateUrl: './section-boundary.component.html',
  styleUrls: ['./section-boundary.component.scss', '../../styles/form.scss']
})
export class SectionBoundaryComponent implements OnInit, OnDestroy {
  public form: FormGroup = this._fb.group({
    sectionBoundary: this._fb.array([])
  });

  public formArray: FormArray = this.form.controls["sectionBoundary"] as FormArray;

  private _dataInLS!: SectionBoundary[];

  public quantityElementsForAdd: number | string = "";

  private _subscription?: Subscription;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _el: ElementsService,
    private readonly _guard: ReportGuard,
    private readonly _valid: ValidService
    ){};

  ngOnInit(): void {
    this._dataInLS = this._el.sectionBoundarys;

    if(this._dataInLS){
      for (let i = 0; i < this._dataInLS.length; i++){
        this.formArray.push(
          this._fb.group({
            numberPipeline: [this._dataInLS[i].numberPipeline, Validators.required],
            numberDistrict: [this._dataInLS[i].numberDistrict, Validators.required],
            name: [this._dataInLS[i].name, Validators.required],
          })
        );
      };
    };

    this._validates();
  };

  private _validates(): void{
    this._guard.isValidSectionBoundary.isValid = this.form.valid;

    this._guard.isValidSectionBoundary.hasAllPipeLine =
    this._valid.checkedHasAllPipeLineInSection();

    this._guard.isValidSectionBoundary.hasRepeat =
    this._valid.checkedHasRepeatInSection();

    this._subscription = this.form.valueChanges.
    pipe(debounceTime(200)).
    subscribe(()=>{
      this._guard.isValidSectionBoundary.isValid = this.form.valid;

      this._guard.isValidSectionBoundary.hasAllPipeLine =
      this._valid.checkedHasAllPipeLineInSection();

      this._guard.isValidSectionBoundary.hasRepeat =
      this._valid.checkedHasRepeatInSection();
    });
  };

  public addNewElements(): void{
    for (let i = 0; i < this.quantityElementsForAdd; i++){
      this.formArray.push(
        this._fb.group({
          numberPipeline: ["", Validators.required],
          numberDistrict: ["", Validators.required],
          name: ["", Validators.required],
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
        numberDistrict: ["", Validators.required],
        name: ["", Validators.required],
      })
    );
  };

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  };
}
