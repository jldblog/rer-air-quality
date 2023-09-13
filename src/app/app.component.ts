import { Component, OnInit } from '@angular/core';
import * as Constants from 'src/app/app-constants';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent implements OnInit {
  public measure: number = Constants.MEASURE_CHOICES.TEMP;
  public showAbout: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  public setMeasure(measure: number) {
    if (this.measure != measure) {
      this.measure = measure;
    }
  }

  public setShowAbout(show: boolean) {
    this.showAbout = show;

    console.log('this.showAbout', this.showAbout)
  }
}
