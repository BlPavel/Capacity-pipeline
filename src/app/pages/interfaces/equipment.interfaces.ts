import { BasicPipelineData } from "./basic-pipeline-data.interfaces";
export interface Equipment extends Omit<BasicPipelineData, "length">{
  name: string,
  capacity: number
};
