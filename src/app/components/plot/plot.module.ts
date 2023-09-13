import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PlotlyModule,
  ]
})

export class PlotModule { }
