import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.sass'],
})

export class PlotComponent {
  @Input() public graph: any = [];

  protected plotID: string = "plotID"; // div id for the plot, useful for ControlComponent#savePlotToPNG()

  constructor() {
  }
}
