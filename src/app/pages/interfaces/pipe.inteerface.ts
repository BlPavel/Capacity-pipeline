import { BasicPipelineData } from "./basic-pipeline-data.interfaces";
export interface Pipe extends Omit<BasicPipelineData, 'quantity'>  {
  diametr: number,
  thickness: number
};
