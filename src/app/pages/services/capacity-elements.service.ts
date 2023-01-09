import { Injectable } from '@angular/core';
import { Pipe } from '../interfaces/pipe.inteerface';
import { Fitting } from '../interfaces/fitting.interface';
import { Plug } from '../interfaces/plug.interface';
import { CapacityService } from './capacity.service';
import { Offset } from '../interfaces/offset.interface';
import { Reducer } from '../interfaces/reducer.interface';
import { Tee } from '../interfaces/tee.interface';
import { Equipment } from '../interfaces/equipment.interfaces';
import { Elements } from '../interfaces/elements.type';

@Injectable({ providedIn: 'root' })

export class CapacityElementsService {

  constructor(private readonly _capacity: CapacityService){};
  public calculatesCapacitePart(pipes: Pipe[], elements: Elements): number{
    const capacitePart: number =
    this.calculatesPipes(pipes) +
    this.calculatesOffsets(elements) +
    this.calculatesOtherElements(elements);
    return Math.round (capacitePart * 1000 ) / 1000;
  };

  public calculatesPipes(pipes: Pipe[]): number{
    let capacity: number = 0;
    for(let i = 0; i < pipes.length; i++){
      capacity += this._capacity.calculatesPipe(pipes[i])
    };
    return Math.round(capacity * 1000) / 1000;
  };

  public calculatesOffsets(elements: Elements): number{
    let capacity: number = 0;
    const offsets: Offset[] = elements[2];
    for(let i = 0; i < offsets.length; i++){
      capacity += this._capacity.calculatesOffset(
        offsets[i] ) * offsets[i].quantity
    };
    return Math.round(capacity * 1000) / 1000;
  };

  public calculatesOtherElements(elements: Elements){
    let capacity: number = 0;
    capacity += this._calculatesFittings(elements[0]);
    capacity += this._calculatesPlugs(elements[1]);
    capacity += this._calculatesReducers(elements[3]);
    capacity += this._calculatesTees(elements[4]);
    capacity += this._calculatesEquipments(elements[5]);
    return Math.round(capacity * 1000) / 1000;
  };

  private _calculatesFittings(fittings: Fitting[]): number{
    let capacity: number = 0;
    for(let i = 0; i < fittings.length; i++){
      capacity += this._capacity.calculatesFitting(
        fittings[i] ) * fittings[i].quantity
    };
    return capacity;
  };

  private _calculatesPlugs(plugs: Plug[]): number{
    let capacity: number = 0;
    for(let i = 0; i < plugs.length; i++){
      capacity += this._capacity.calculatesPlug(
        plugs[i] ) * plugs[i].quantity
    };
    return capacity;
  };

  private _calculatesReducers(reducers: Reducer[]): number{
    let capacity: number = 0;
    for(let i = 0; i < reducers.length; i++){
      capacity += this._capacity.calculatesReducer(
        reducers[i] ) * reducers[i].quantity
    };
    return capacity;
  };

  private _calculatesTees(tees: Tee[]): number{
    let capacity: number = 0;
    for(let i = 0; i < tees.length; i++){
      capacity += this._capacity.calculatesTee(
        tees[i] ) * tees[i].quantity
    };
    return capacity;
  };

  private _calculatesEquipments(equipments: Equipment[]): number{
    let capacity: number = 0
    for(let i = 0; i < equipments.length; i++){
      capacity += equipments[i].capacity * equipments[i].quantity
    };
    return capacity;
  };
};
