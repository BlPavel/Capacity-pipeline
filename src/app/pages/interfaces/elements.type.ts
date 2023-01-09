import { Tee } from './tee.interface';
import { Reducer } from './reducer.interface';
import { Offset } from './offset.interface';
import { Plug } from './plug.interface';
import { Fitting } from "./fitting.interface";
import { Equipment } from './equipment.interfaces';

export type Elements = [
  Fitting[],
  Plug[],
  Offset[],
  Reducer[],
  Tee[],
  Equipment[]
];
