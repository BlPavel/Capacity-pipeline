export interface CapacityPipeLine{
  numberDistrict: number,
  nameDistrict: string,
  nameElements: string,
  quantityElements: number,
  lengthPipeLine: number,
  nominalDiametr: number,
  capacity: Capacity,
  capacityPart: number,
  capacityCumulative: number
}

export interface Capacity{
  pipe: number,
  offset: number,
  other: number
}
