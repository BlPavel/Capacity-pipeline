import { BasicPipelineData } from "./basic-pipeline-data.interfaces";
export interface Reducer extends BasicPipelineData{
  diametrAfterReducer: number,
  type: string
};
