import { Injectable } from '@angular/core';
import { Fitting } from '../interfaces/fitting.interface';
import { Offset } from '../interfaces/offset.interface';
import { Pipe } from '../interfaces/pipe.inteerface';
import { Plug } from '../interfaces/plug.interface';
import { Reducer } from '../interfaces/reducer.interface';
import { Tee } from '../interfaces/tee.interface';

@Injectable({ providedIn: 'root' })
export class CapacityService {
  public calculatesPipe(pipe: Pipe): number{
    const innerDiameter: number = pipe.diametr - 2 * pipe.thickness;
    return this._calculatesCylinder(innerDiameter, pipe.length) * 1000;
  };

  public calculatesFitting(fitting: Fitting): number{
    if(fitting.type === "Обратный клапан"){
      return this._calculatesCheckValve(fitting);
    }
    else{
      return this._calculatesGateValve(fitting);
    };
  };

  private _calculatesCheckValve(fitting: Fitting): number{
    return this._calculatesGateValve(fitting) * 1.3;
  };

  private _calculatesGateValve(fitting: Fitting): number{
    const capacity: number =
    this._calculatesCylinder(fitting.nominalDiametr, fitting.length);

    if(fitting.capacityValue === "Полная"){
      return capacity;
    }
    else{
      return capacity * 0.5;
    };
  };

  public calculatesPlug(plug: Plug): number{
    const adjustmentCoefficient: number = plug.type === "Эллиптическая" ?
     1 + 0.13*(plug.nominalDiametr / plug.length) :
     1;
    return this._calculatesCylinder(
      plug.nominalDiametr, plug.length) * adjustmentCoefficient;
  };

  public calculatesOffset(offset: Offset): number{
    const mediumLength = (offset.length1 + offset.length2) / 2;
    return this._calculatesCylinder(offset.nominalDiametr, mediumLength);
  };

  public calculatesReducer(reducer: Reducer): number{
    const mediumDiametr: number = reducer.nominalDiametr ** 2 +
    reducer.nominalDiametr * reducer.diametrAfterReducer +
    reducer.diametrAfterReducer ** 2;
    const capacity: number = (Math.PI * reducer.length) /
    (12 * (10 ** 9)) * mediumDiametr;
    return capacity;
  };

  public calculatesTee(tee: Tee): number{
    if(tee.nominalDiametr === tee.diametrBranch){
      return this._calculatesEqualTee(tee)
    }
    else{
      return this._calculatesTransitionTee(tee)
    }
  }

  private _calculatesEqualTee(tee: Tee): number{
    const constructionLength: number = Math.abs(
      tee.length + tee.lengthBranch +   (tee.nominalDiametr / 3) * (3 - 8 / Math.PI)
      );
    return this._calculatesCylinder(tee.nominalDiametr, constructionLength);
  };

  private _calculatesTransitionTee(tee: Tee): number{
    const coefficient: number = Math.PI / (4 * (10 ** 9))
    return coefficient * ((tee.nominalDiametr ** 2) * tee.length +
    (tee.diametrBranch ** 2) * tee.lengthBranch);
  };

  private _calculatesCylinder(diametr: number, length: number): number{
    const capacity: number = (Math.PI * (diametr ** 2)) /
    (4 * (10 ** 9)) * length;
    return capacity;
  };
};
