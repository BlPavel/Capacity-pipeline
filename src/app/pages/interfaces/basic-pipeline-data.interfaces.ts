import { Quantity } from './quantity.interface';
import { MinInfo } from './min-info.interface';
export interface BasicPipelineData extends MinInfo, Quantity{
  nominalDiametr: number,
  length: number
};
