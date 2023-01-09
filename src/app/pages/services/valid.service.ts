import { SectionBoundary } from './../interfaces/section-boundary.interface';
import { ElementsService } from './elements.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidService {

  constructor(
    private readonly _el: ElementsService
    ){};

  public checkedHasAllPipeLineInSection(): boolean{
    let hasAllPipeLine: boolean = true;
    const numberPipeLines: number[] = this._el.commonData.pipeLine.map(
      item => { return item['numberPipeLine'] }
    );
    const dataForCheck: number[] = this._el.sectionBoundarys.map(
      item => { return item['numberPipeline'] });

    for (let i =0; i < numberPipeLines.length; i++){
      if(!dataForCheck.includes(numberPipeLines[i])){
        hasAllPipeLine = false;
        break;
      };
    };

    return hasAllPipeLine;
  };

  public checkedHasRepeatInSection(): boolean{
    const dataForCheck: number[][] = this._el.sectionBoundarys.map(
      item => {
        return [
          item['numberPipeline'], item['numberDistrict']
        ]
      });
    let connectedNumber: string[] = [];

    for (let i = 0; i < dataForCheck.length; i++){
      connectedNumber.push(
        dataForCheck[i][0].toString() + dataForCheck[i][1]
      );
    };

    const deleteDublicat: string[] = [...new Set(connectedNumber)];
    if(
      connectedNumber.length !=
      deleteDublicat.length ) return true;
    else return false;
  };

  public checkedHasRepeatInCommon(): boolean{
    const dataForCheck: number[] = this._el.commonData.pipeLine.map(
      item => { return item['numberPipeLine'] }
    );
    let connectedNumber: string[] = [];

    for (let i = 0; i < dataForCheck.length; i++){
      connectedNumber.push(
        dataForCheck[i].toString() + dataForCheck[i]
      );
    };

    const deleteDublicat: string[] = [...new Set(connectedNumber)];
    if(
      connectedNumber.length !=
      deleteDublicat.length ) return true;
    else return false;
  };

  public findMissingDataInPipe(): string{
    let missingData: string = "";
    const sectionBoundarys: number[][] =
    this._el.sectionBoundarys.map(
      item =>{ return [
        item['numberPipeline'], item['numberDistrict']
      ]}
    );
    let connectedSectionBoundarys: string[] = [];

    for (let i = 0; i < sectionBoundarys.length; i++){
      connectedSectionBoundarys.push(
        sectionBoundarys[i][0].toString() + "-" +
        sectionBoundarys[i][1]
      );
    };

    const pipes: number[][] = this._el.pipes.map(
      item =>{ return [
        item['numberPipeline'], item['numberDistrict']
      ]}
    );
    let connectedPipes: string [] = [];

    for (let i = 0; i < pipes.length; i++){
      connectedPipes.push(
        pipes[i][0].toString() + "-" +
        pipes[i][1]
      );
    };

    for (let i = 0; i < connectedSectionBoundarys.length; i++){
      if(!connectedPipes.includes(
        connectedSectionBoundarys[i])
        ){
        const separete = connectedSectionBoundarys[i].split('-')
        missingData =
        `Для трубопровода ${separete[0]} участка ${separete[1]} не введена ни одна труба`;
        break;
      };
    };
    return missingData;
  };
};
