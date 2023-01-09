import { BasicPipelineData } from './../interfaces/basic-pipeline-data.interfaces';
import { Tee } from './../interfaces/tee.interface';
import { Offset } from './../interfaces/offset.interface';
import { Elements } from './../interfaces/elements.type';
import { Injectable } from '@angular/core';
import { Pipe } from '../interfaces/pipe.inteerface';

@Injectable({ providedIn: 'root' })
export class LengthPipelineService {

  constructor() { }

  public calculates(elements: Elements, pipe: Pipe[]): number{
    let length: number = 0;
    length += this._calculatesLengthPipe(pipe);
    length += this._calculatesOffsetLength(elements[2]);
    length += this._calculatesTeeLength(elements[4]);
    length += this._calculatesOtherElements(elements[0]);
    length += this._calculatesOtherElements(elements[1]);
    length += this._calculatesOtherElements(elements[3]);
    return length;
  };

  private _calculatesLengthPipe(pipes: Pipe[]):number{
    const length: number = pipes.reduce((accum, elem)=>{
      return accum + elem.length
    }, 0) * 1000;
    return Math.round(length * 1000) / 1000;
  };

  private _calculatesOffsetLength(offsets: Offset[]): number{
    let length: number = 0
    for(let i = 0; i < offsets.length; i++ ){
      length += (offsets[i].length1 + offsets[i].length2) /
      2 * offsets[i].quantity
    }
    return length
  };

  private _calculatesTeeLength(tees: Tee[]): number{
    let length: number = 0
    for (let i = 0; i < tees.length; i++){
      length += (tees[i].length + tees[i].lengthBranch) *
      tees[i].quantity;
    };
    return length;
  };

  private _calculatesOtherElements<T extends BasicPipelineData>
  (array: T[]): number{
    let length: number = 0
    for (let i = 0; i < array.length; i++){
      length += array[i].length * array[i].quantity
    };
    return length;
  };
};
