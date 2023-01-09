import { GraduationByPipeLine } from './../interfaces/graduation-pipeline.interface';
import { GraduationByDistrict } from './../interfaces/graduation-district.interface';
import { Injectable } from '@angular/core';
import { CapacityPipeLine } from '../interfaces/capacity-pipeline.interface';

@Injectable({ providedIn: 'root' })
export class StoreService {
  public capacityPipeLine: CapacityPipeLine[][] = [];

  public graduationDistrict: GraduationByDistrict[][] = [];

  public graduationPipeLine: GraduationByPipeLine[] = [];
}
