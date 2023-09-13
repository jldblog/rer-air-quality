import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { isEmpty } from 'radash';
import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/internal/operators/catchError";
import * as Constants from 'src/app/app-constants';

@Injectable()
export class DataService {
    private baseUrl: string = "https://data.ratp.fr/api/explore/v2.1/catalog/datasets/";
    private dataset_auber: string = 'qualite-de-lair-mesuree-dans-la-station-auber';
    private dataset_chatelet: string = 'qualite-de-lair-mesuree-dans-la-station-chatelet-rer-a0';
    private dataset_nation: string = 'qualite-de-lair-mesuree-dans-la-station-nation-rer-a0';
    private currentFromDate!: Date;
    private currentToDate!: Date;
    private currentData: any = {};

    constructor(private httpClient: HttpClient, private messageService: MessageService) { }

    private getDataAuber(from: string, to: string): Promise<any> {
        return this.getDataPromise(from, to, this.dataset_auber);
    }

    private getDataChatelet(from: string, to: string): Promise<any> {
        return this.getDataPromise(from, to, this.dataset_chatelet);
    }

    private getDataNation(from: string, to: string): Promise<any> {
        return this.getDataPromise(from, to, this.dataset_nation);
    }

    public getGraphPromise(fromDate: Date, toDate: Date, measurement: number): Promise<any> {
        const from: string = fromDate.toISOString().substring(0, 10);
        const to: string = toDate.toISOString().substring(0, 10);

        return new Promise((resolve, reject) => {
            var result: any = [];

            if (this.currentFromDate != fromDate || this.currentToDate != toDate) {
                this.currentFromDate = fromDate;
                this.currentToDate = toDate;

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

                    result['graph'] = this.createGraph(measurement);;
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

    private getDataPromise(from: string, to: string, dataset: string): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const endpoint: string = this.baseUrl + dataset + '/exports/json';

                try {
                    this.getData(from, to, endpoint).subscribe((data: any) => {
                        resolve(data);
                    });
                }
                catch (error: any) {
                    console.log("error.message", error.message);
                };
            });
        });
    }

    private getData(from: string, to: String, endpoint: string): Observable<any> {
        let params: string = '?limit=-1&timezone=UTC&use_labels=false&epsg=4326';
        params = params + "&where=dateheure>=date'" + from + "' AND dateheure<=date'" + to + "'";
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