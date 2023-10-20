import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Plotly from 'angular-plotly.js';
import { FileSaverService } from 'ngx-filesaver';
import { MenuItem } from 'primeng/api';
import * as Constants from 'src/app/app-constants';
import { DataService } from 'src/app/services/data.service';

interface Choice {
  label: string;
  code: number;
}

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.sass']
})

export class ControlComponent implements OnChanges, OnInit {
  @Input() public measure: number = -1;
  protected choices: Choice[] = [
    // { label: '1 semaine', code: Constants.PERIOD.ONE_WEEK },
    { label: '2 semaines', code: Constants.PERIOD.TWO_WEEKS },
    { label: '1 mois', code: Constants.PERIOD.ONE_MONTH },
    { label: '3 mois', code: Constants.PERIOD.THREE_MONTHS },
    // { label: '6 mois', code: Constants.PERIOD.SIX_MONTHS },
    // { label: 'Année courante', code: Constants.PERIOD.CURRENT_YEAR },
    { label: 'Libre choix des dates', code: Constants.PERIOD.FREE_CHOICE },
  ];
  protected selectedChoice!: Choice;
  private FIRST_DATE = new Date('2013-01-01');
  protected dateFrom!: Date;
  protected dateTo!: Date;
  protected minDateFrom!: Date;
  protected maxDateFrom!: Date;
  protected minDateTo!: Date;
  protected maxDateTo!: Date;
  protected graph: any = [];
  protected displayProgress: boolean = false;
  protected message: string = '';
  private progressStartDate!: Date;
  protected hideDates: boolean = true;

  protected saveItems: MenuItem[] = [
    {
      tooltipOptions: {
        tooltipLabel: 'Sauvegarder'
      },
      icon: 'bi bi-save',
      items: [
        {
          tooltipOptions: {
            tooltipLabel: 'Sauvegarder le graphique au format PNG'
          },
          label: 'Graphique en PNG',
          icon: 'bi bi-filetype-png app-x',
          command: () => {
            this.savePlotImage('png');
          }
        },
        {
          tooltipOptions: {
            tooltipLabel: 'Sauvegarder le graphique au format SVG'
          },
          label: 'Graphique en SVG',
          icon: 'bi bi-filetype-svg',
          command: () => {
            this.savePlotImage('svg');
          }
        },
        {
          tooltipOptions: {
            tooltipLabel: 'Sauvegarder les données au format JSON'
          },
          label: 'Data en JSON',
          icon: 'bi bi-filetype-json',
          command: () => {
            this.saveCurrentDataToJSON();
          }
        },
      ]
    },
  ];

  constructor(private fileSaverService: FileSaverService, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.graph = Constants.EMPTY_GRAPH;
    this.initDates();
    this.selectedChoice = this.choices[0];
    this.onChoiceChange(this.selectedChoice.code);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measure'].previousValue != undefined) {
      this.onDisplayResults();
    }
  }

  public initDates() {
    const now: Date = new Date();
    this.minDateFrom = this.FIRST_DATE;
    this.maxDateFrom = now
    this.maxDateTo = this.maxDateFrom;
    this.dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    this.dateTo = now;
  }

  private adjustMinMax() {
    this.maxDateFrom = this.dateTo;
    this.minDateTo = this.dateFrom;
  }

  protected onDisplayResults() {
    this.progressStartDate = new Date();
    this.displayProgress = true;

    this.dataService.getGraphToDisplayPromise(this.selectedChoice.code, this.dateFrom, this.dateTo, this.measure).then(result => {
      this.graph = result.graph;
      const newData = result.newData;
      const milliseconds: number = new Date().getTime() - this.progressStartDate.getTime();
      this.message = this.formatMessage(milliseconds, newData);
      this.displayProgress = false;
    });
  }

  protected onDateChange() {
    this.adjustMinMax();
  }

  protected onChoiceChange(choiceCode: number) {
    if (choiceCode == Constants.PERIOD.FREE_CHOICE) {
      this.hideDates = false;
    }
    else {
      this.hideDates = true;
      this.onDisplayResults();
    }
  }

  private savePlotImage(format: string) {
    Plotly.PlotlyModule.plotlyjs.downloadImage(
      "plotID", {
      filename: 'plot',
      format: format,
      // height: 800,
      // width: 400,
    });
  }

  private saveCurrentDataToJSON() {
    var blob = new Blob([JSON.stringify(this.dataService.getCurrentData())], { type: "application/json" });
    this.fileSaverService.save(blob, "data.json");
  }

  public getDateFrom(): Date {
    return this.dateFrom;
  }

  public getDateTo(): Date {
    return this.dateTo;
  }

  private millisecondsToMMSS(milliseconds: number): string {
    const minutes: number = Math.floor(milliseconds / 1000 / 60);
    const seconds: number = Math.floor(milliseconds / 1000 % 60);
    var results: string = '';

    if (minutes != 0) {
      results = results + minutes + 'mn et ';
    }

    results = results + seconds + 's';

    return results;
  }

  private formatMessage(milliseconds: number, newData: boolean): string {
    var msg = '';

    if (newData) {
      msg = 'Requêtes réalisées en ';

      if (milliseconds >= 1000) {
        msg = msg + this.millisecondsToMMSS(milliseconds);
      }
      else {
        msg = msg + milliseconds + 'ms';
      }
    }

    return msg;
  }
}
