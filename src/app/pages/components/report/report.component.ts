import { ReportGuard } from './../../../guards/report.guard';
import { FileService } from './../../services/file.service';
import { GraduationByPipeLine } from './../../interfaces/graduation-pipeline.interface';
import { StoreService } from './../../services/store.service';
import { ElementsService } from '../../services/elements.service';
import { ReportService } from './../../services/report.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WordService } from '../../services/word/word.service';
import { GraduationByDistrict } from '../../interfaces/graduation-district.interface';
import { CapacityPipeLineService } from '../../services/capacity-pipeline.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public namePipeLines!: string[];

  public namePipe: string = this._el.commonData.name;

  public graduationDistrict: GraduationByDistrict[][] = [];

  public graduationPipeLine: GraduationByPipeLine[] = []


  constructor(
    private readonly _word: WordService,
    private readonly _LS: LocalStorageService,
    private readonly _report: ReportService,
    private readonly _el: ElementsService,
    private readonly _store: StoreService,
    private readonly _capacityPL: CapacityPipeLineService,
    private readonly _file: FileService,
    ){};

  ngOnInit(): void {
    this._init();
  };

  private _init(): void{
    this.namePipeLines = this._el.namePipeLines;

    this._store.capacityPipeLine.splice(0,
      this._store.capacityPipeLine.length,
    );
    this._store.graduationDistrict.splice(0,
      this._store.graduationDistrict.length
    );

    for (let i = 0; i < this.namePipeLines.length; i++){
      this._store.capacityPipeLine.push(
        this._capacityPL.calculatesCapacityPipeLines(i)
      );
    };

    for(let i = 0; i < this.namePipeLines.length; i++){
      this._store.graduationDistrict.push(
        this._report.calculatesGraduationByDistrict(i)
      );
    };

    this._store.graduationPipeLine =
    this._report.calculatesGraduationByPipeLine();

    this.graduationDistrict = this._store.graduationDistrict;

    this.graduationPipeLine = this._store.graduationPipeLine;
  };

  public save(): void{
    this._file.save();
  };

  public saveWord(): void{
    this._word.save();
  }
};
