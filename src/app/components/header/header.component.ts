import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as Constants from 'src/app/app-constants';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})

export class HeaderComponent {
  @Output() measureEvent = new EventEmitter<number>();
  @Output() auboutEvent = new EventEmitter<boolean>();
  protected darkTheme: boolean = false;

  protected items1: MenuItem[] = [
    {
      label: 'Température',
      icon: 'bi bi-thermometer-half app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.TEMP);
      }
    },
    {
      label: 'Humidité',
      icon: 'bi bi-droplet app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.HUMI);
      }
    },
    {
      label: 'CO₂',
      icon: 'bi bi-cloud app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.CO2);
      }
    },
    {
      label: 'NO',
      icon: 'bi bi-cloud app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.NO);
      }
    },
    {
      label: 'NO₂',
      icon: 'bi bi-cloud app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.NO2);
      }
    },
    {
      label: 'PM<sub>10</sub>',
      escape: false,
      icon: 'bi bi-stars app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.PM10);
      }
    },
    {
      label: 'PM<sub>2,5</sub>',
      escape: false,
      icon: 'bi bi-stars app-x',
      command: () => {
        this.setMeasure(Constants.MEASURE_CHOICES.PM25);
      }
    },
  ];

  protected items2: MenuItem[] = [
    {
      label: 'À propos',
      icon: 'bi bi-info-circle app-x',
      command: () => {
        this.setShowAbout(true);
      }
    },
  ];

  constructor(private themeService: ThemeService) { }

  public setMeasure(measure: number) {
    this.measureEvent.emit(measure);
  }

  public setShowAbout(show: boolean) {
    this.auboutEvent.emit(show);
  }

  protected onThemeChange() {
    this.setTheme();
  }

  private setTheme() {
    if (this.darkTheme) {
      this.themeService.switchTheme('dark-theme');
    }
    else {
      this.themeService.switchTheme('light-theme');
    }
  }
}
