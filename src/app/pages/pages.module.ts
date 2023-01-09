import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PipeComponent } from './components/pipe/pipe.component';
import { LocalStorageDirective } from './directives/local-storage.directive';
import { MovingBetweenInputDirective } from './directives/moving-between-input.directive';
import { OffsetComponent } from './components/offset/offset.component';
import { ReducerComponent } from './components/reducer/reducer.component';
import { TeeComponent } from './components/tee/tee.component';
import { PlugComponent } from './components/plug/plug.component';
import { FittingComponent } from './components/fitting/fitting.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { CommonDataComponent } from './components/common-data/common-data.component';
import { SectionBoundaryComponent } from './components/section-boundary/section-boundary.component';
import { ReportComponent } from './components/report/report.component';



@NgModule({
  declarations: [
    PipeComponent,
    LocalStorageDirective,
    MovingBetweenInputDirective,
    OffsetComponent,
    ReducerComponent,
    TeeComponent,
    PlugComponent,
    FittingComponent,
    EquipmentComponent,
    CommonDataComponent,
    SectionBoundaryComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ PipeComponent ],
  // providers: [CommonDataComponent]
})
export class PagesModule { }
