import { MinInfo } from "./min-info.interface";

export interface GraduationByDistrict extends MinInfo{
  nameDistrict: string,
  length: number,
  capacity: number,
  lengthCumulative: number,
  capacityCumulative: number
}
