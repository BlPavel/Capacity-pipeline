import { BasicPipelineData } from "./basic-pipeline-data.interfaces";
export interface Offset extends Omit<BasicPipelineData, 'length'> {
  length1: number,
  length2: number,
  type: string,
};
