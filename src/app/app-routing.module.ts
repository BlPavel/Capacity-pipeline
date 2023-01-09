import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanDeactivate } from '@angular/router';
import { PipeComponent } from './pages/components/pipe/pipe.component';
import { OffsetComponent } from './pages/components/offset/offset.component';
import { ReducerComponent } from './pages/components/reducer/reducer.component';
import { TeeComponent } from './pages/components/tee/tee.component';
import { PlugComponent } from './pages/components/plug/plug.component';
import { FittingComponent } from './pages/components/fitting/fitting.component';
import { EquipmentComponent } from './pages/components/equipment/equipment.component';
import { CommonDataComponent } from './pages/components/common-data/common-data.component';
import { SectionBoundaryComponent } from './pages/components/section-boundary/section-boundary.component';
import { ReportComponent } from './pages/components/report/report.component';
import { ReportGuard } from './guards/report.guard';

const routes: Routes = [
  {
    path: '',
    component: CommonDataComponent,
    data: { title: 'Общие данные' },
  },
  {
    path: 'section',
    component: SectionBoundaryComponent,
    data: { title: 'Границы участков' },
  },
  {
    path: 'pipe',
    component: PipeComponent,
    data: { title: 'Параметры трубы' },
  },
  {
    path: 'offset',
    component: OffsetComponent,
    data: { title: 'Параметры отвода' },
  },
  {
    path: 'reducer',
    component: ReducerComponent,
    data: { title: 'Параметры перехода' },
  },
  {
    path: 'tee',
    component: TeeComponent,
    data: { title: 'Параметры тройника' },
  },
  {
    path: 'plug',
    component: PlugComponent,
    data: { title: 'Параметры заглушки' },
  },
  {
    path: 'fitting',
    component: FittingComponent,
    data: { title: 'Параметры арматуры' },
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    data: { title: 'Параметры оборудования' },
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [ReportGuard],
    data: { title: 'Отчет' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
