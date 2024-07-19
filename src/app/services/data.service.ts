import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DateTime } from 'luxon';
import { MessageService } from "primeng/api";
import { isEmpty } from 'radash';
import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/internal/operators/catchError";
import * as Constants from 'src/app/app-constants';

@Injectable()
export class DataService {
    private baseUrl: string = "https://data.ratp.fr/api/explore/v2.1/catalog/datasets/";
    private dataset_auber: string = 'qualite-de-lair-mesuree-dans-la-station-auber-2021-a-nos-jours';
    private dataset_chatelet: string = 'qualite-de-lair-mesuree-dans-la-station-chatelet-rer-a0';
    private dataset_nation: string = 'qualite-de-lair-mesuree-dans-la-station-nation-rer-a0';
    private currentFrom!: string;
    private currentTo!: string;
    private currentData: any = {};

    constructor(private httpClient: HttpClient, private messageService: MessageService) { }

    private getDataAuber(from: string, to: string): Promise<any> {
        return this.getDataPromise(-1, from, to, this.dataset_auber);
    }

    private getDataAuberLastRecord(to: string): Promise<any> {
        return this.getDataPromise(1, '', to, this.dataset_auber);
    }

    private getDataChatelet(from: string, to: string): Promise<any> {
        return this.getDataPromise(-1, from, to, this.dataset_chatelet);
    }

    private getDataNation(from: string, to: string): Promise<any> {
        return this.getDataPromise(-1, from, to, this.dataset_nation);
    }

    private computeFrom(dtTo: DateTime, choiceCode: number): DateTime {
        var dtFrom = dtTo;

        switch (choiceCode) {
            case Constants.PERIOD.ONE_WEEK:
                dtFrom = dtTo.minus({ weeks: 1 }).startOf('day');
                break;
            case Constants.PERIOD.TWO_WEEKS:
                dtFrom = dtTo.minus({ weeks: 2 }).startOf('day');
                break;
            case Constants.PERIOD.ONE_MONTH:
                dtFrom = dtTo.minus({ months: 1 }).startOf('day')
                break;
            case Constants.PERIOD.THREE_MONTHS:
                dtFrom = dtTo.minus({ months: 3 }).startOf('day')
                break;
            case Constants.PERIOD.SIX_MONTHS:
                dtFrom = dtTo.minus({ months: 6 }).startOf('day')
                break;
            default:
                // TODO
                break;
        }

        return dtFrom;
    }

    private getFromToPromise(choiceCode: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var result: any = [];
            const dtNow = DateTime.now();
            var to = dtNow.toISO()!.substring(0, 10);

            this.getDataAuberLastRecord(to).then(data => {
                const dataAuber: any = data;
                var dtTo = DateTime.fromISO(dataAuber[0].dateheure.substring(0, 10));
                var dtFrom = this.computeFrom(dtTo, choiceCode);
                result['from'] = dtFrom!.toISO()!.substring(0, 10);
                result['to'] = dtTo.toISO()!.substring(0, 10);
                resolve(result);
            });
        });
    }

    public getGraphToDisplayPromise(choiceCode: number, fromDate: Date, toDate: Date, measurement: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (choiceCode == Constants.PERIOD.FREE_CHOICE) {
                const from: string = fromDate.toISOString().substring(0, 10);
                const to: string = toDate.toISOString().substring(0, 10);

                this.getGraphPromise(from, to, measurement).then(result => {
                    resolve(result);
                });
            }
            else {
                this.getFromToPromise(choiceCode).then(result1 => {
                    const from: string = result1['from'];
                    const to: string = result1['to'];

                    this.getGraphPromise(from, to, measurement).then(result2 => {
                        result2['lastUpdate'] = to;
                        resolve(result2);
                    });
                });
            }
        });
    }

    private getGraphPromise(from: string, to: string, measurement: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var result: any = [];

            if (this.currentFrom != from || this.currentTo != to) {
                this.currentFrom = from;
                this.currentTo = to;

                Promise.all([
                    this.getDataAuber(from, to),
                    this.getDataChatelet(from, to),
                    this.getDataNation(from, to),
                ]).then(results => {
                    const dataAuber: any = results[0];
                    const dataChatelet: any = results[1];
                    const dataNation: any = results[2];

                    this.currentData = {};
                    this.currentData[Constants.STATIONS.auber_rera] = dataAuber;
                    this.currentData[Constants.STATIONS.chatelet_rera] = dataChatelet;
                    this.currentData[Constants.STATIONS.nation_rera] = dataNation;

                    result['graph'] = this.createGraph(measurement);
                    result['newData'] = true;
                    resolve(result);
                });
            }
            else {
                result['graph'] = this.createGraph(measurement);
                result['newData'] = false;
                resolve(result);
            }
        });
    }

    private createGraph(measurement: number): any {
        var graph: any = Constants.EMPTY_GRAPH;
        const data = [
            this.prepareData(Constants.STATIONS.auber_rera, measurement),
            this.prepareData(Constants.STATIONS.chatelet_rera, measurement),
            this.prepareData(Constants.STATIONS.nation_rera, measurement)
        ];

        if (!isEmpty(data[0]) || !isEmpty(data[1]) || !isEmpty(data[2])) {
            graph = {
                data: data,
                layout: this.selectLayout(measurement),
            };
        }

        return graph;
    }

    private selectLayout(measurement: number): any {
        var layout: any = {};

        switch (measurement) {
            case (Constants.MEASURE_CHOICES.CO2):
                layout = Constants.LAYOUT_CO2;
                break;
            case (Constants.MEASURE_CHOICES.HUMI):
                layout = Constants.LAYOUT_HUMIDITY;
                break;
            case (Constants.MEASURE_CHOICES.NO):
                layout = Constants.LAYOUT_NO;
                break;
            case (Constants.MEASURE_CHOICES.NO2):
                layout = Constants.LAYOUT_NO2;
                break;
            case (Constants.MEASURE_CHOICES.PM10):
                layout = Constants.LAYOUT_PM10;
                break;
            case (Constants.MEASURE_CHOICES.PM25):
                layout = Constants.LAYOUT_PM25
                break;
            case (Constants.MEASURE_CHOICES.TEMP):
                layout = Constants.LAYOUT_TEMPERATURE;
                break;
        }

        return layout;
    }

    private prepareData(station: any, measurement: number): any {
        const data = this.currentData[station];
        let x: any = [];
        let y: any = [];
        let measure: any;

        data.forEach((elmt: any) => {
            let value: number = NaN;

            switch (measurement) {
                case (Constants.MEASURE_CHOICES.CO2):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt.c2auba;
                            break;
                        // pas de donnée C02 pour Châtelet et Nation
                    }
                    break;
                case (Constants.MEASURE_CHOICES.HUMI):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt.hyauba;
                            break;
                        case Constants.STATIONS.chatelet_rera:
                            measure = elmt.hychata;
                            break;
                        case Constants.STATIONS.nation_rera:
                            measure = elmt.hynata;
                            break;
                    }
                    break;
                case (Constants.MEASURE_CHOICES.NO):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt.noauba;
                            break;
                        // pas de donnée NO pour Châtelet et Nation
                    }
                    break;
                case (Constants.MEASURE_CHOICES.NO2):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt.n2auba;
                            break;
                        // pas de donnée N02 pour Châtelet et Nation
                    }
                    break;
                case (Constants.MEASURE_CHOICES.PM10):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt['10auba'];
                            break;
                        case Constants.STATIONS.chatelet_rera:
                            measure = elmt['10chata'];
                            break;
                        case Constants.STATIONS.nation_rera:
                            measure = elmt['10nata'];
                            break;
                    }
                    break;
                case (Constants.MEASURE_CHOICES.PM25):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt['25auba'];
                            break;
                        case Constants.STATIONS.nation_rera:
                            measure = elmt['25nata'];
                            break;
                        // pas de donnée PM25 pour Châtelet
                    }
                    break;
                case (Constants.MEASURE_CHOICES.TEMP):
                    switch (station) {
                        case Constants.STATIONS.auber_rera:
                            measure = elmt.tauba;
                            break;
                        case Constants.STATIONS.chatelet_rera:
                            measure = elmt.tchata;
                            break;
                        case Constants.STATIONS.nation_rera:
                            measure = elmt.tnata;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            };

            if (measure) {
                value = parseFloat(measure.replace(',', '.'));

                if (!isNaN(value)) {
                    x.push(elmt.dateheure);
                    y.push(value);
                }
            }
        });

        let result = {};

        if (x.length != 0) {
            result = {
                type: 'scatter',
                name: station,
                x: x,
                y: y,
                line: { width: 2 }
            };
        }

        return result;
    }

    private getDataPromise(limit: number, from: string, to: string, dataset: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const endpoint: string = this.baseUrl + dataset + '/exports/json';

                try {
                    this.getData(limit, from, to, endpoint).subscribe((data: any) => {
                        resolve(data);
                    });
                }
                catch (error: any) {
                    console.log("error.message", error.message);
                };
            });
        });
    }

    private getData(limit: number, from: string, to: String, endpoint: string): Observable<any> {
        let params: string = '?limit=' + limit + '&timezone=UTC&use_labels=false&epsg=4326';

        if (from) {
            params = params + "&where=dateheure>=date'" + from + "'";

            if (to) {
                params = params + "%20AND%20dateheure<=date'" + to + "'";
            }
        }
        else if (to) {
            params = params + "&where=dateheure<=date'" + to + "'";
        }

        const url: string = endpoint + params;

        return this.httpClient.get(url).pipe(catchError(
            error => {
                var errorMessage: string;

                if (error.error instanceof ErrorEvent) {
                    errorMessage = error.error.message;
                } else {
                    errorMessage = error.message;
                }

                this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
                return of([]);
            })
        );
    }

    public getCurrentData(): any {
        return this.currentData;
    }
}