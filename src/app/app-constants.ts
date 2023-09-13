const WIDTH: number = 1400;
const HEIGHT: number = 620;
const BGCOLOR: string = '#f5f5f5';

export enum PERIOD {
    ONE_WEEK,
    TWO_WEEKS,
    ONE_MONTH,
    THREE_MONTHS,
    SIX_MONTHS,
    CURRENT_YEAR,
    FREE_CHOICE,
};

export enum MEASURE_CHOICES {
    CO2,
    HUMI,
    NO,
    NO2,
    PM10,
    PM25,
    TEMP,
};

export enum STATIONS {
    auber_rera = 'Auber RER A',
    chatelet_rera = 'Châtelet RER A',
    nation_rera = 'Nation RER A'
};

export const EMPTY_GRAPH: any = Object.freeze({
    layout: {
        width: WIDTH,
        height: HEIGHT,
        plot_bgcolor: BGCOLOR,
        paper_bgcolor: BGCOLOR,
        xaxis: {
            visible: false
        },
        yaxis: {
            visible: false
        },
        annotations: [
            {
                text: "Pas de donnée",
                xref: "paper",
                yref: "paper",

                showarrow: false,
                font: {
                    size: 14,
                }
            }
        ]
    }
});

export const LAYOUT_COMMON: any = Object.freeze({
    showlegend: true,
    width: WIDTH,
    height: HEIGHT,
    plot_bgcolor: BGCOLOR,
    paper_bgcolor: BGCOLOR,
    font: {
        family: 'Roboto',
        size: 14,
    },
    legend: {
        "orientation": "h",
        yanchor: 'top', y: -0.2, xanchor: 'right', x: 1.0, bgcolor: '#efefef',
        font: {
            family: 'Roboto',
            size: 12,
        },
    },
    annotations: [{
        text: 'Source : <a href="https://data.ratp.fr/">https://data.ratp.fr/</a>',
        xref: 'paper',
        yref: 'paper',
        x: 0.0,
        y: -0.27,
        showarrow: false,
    }],
    xaxis: {
        title: {
            text: '<b>Date</b>',
        },
    },
});

export const LAYOUT_TEMPERATURE: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>Température</b><br />',
    yaxis: {
        title: {
            text: '<b>Température °C</b>',
        },
    },
});

export const LAYOUT_HUMIDITY: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>Humidité relative</b><br />',
    yaxis: {
        title: {
            text: '<b>Humidité %</b>',
        },
    },
});

export const LAYOUT_CO2: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>CO₂</b><br />',
    yaxis: {
        title: {
            text: '<b>CO₂ ppm</b>',
        },
    },
});

export const LAYOUT_NO: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>NO</b><br />',
    yaxis: {
        title: {
            text: '<b>NO μg/m3</b>',
        },
    },
});

export const LAYOUT_NO2: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>NO₂</b><br />',
    yaxis: {
        title: {
            text: '<b>NO₂ μg/m3</b>',
        },
    },
});

export const LAYOUT_PM10: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>PM<sub>10</sub> (particules d\'un diamètre inférieur à 10µm)</b>',
    yaxis: {
        title: {
            text: '<b>PM<sub>10</sub> μg/m3</b>',
        },
    },
});

export const LAYOUT_PM25: any = Object.freeze({
    ...LAYOUT_COMMON,
    title: '<b>PM<sub>2,5</sub> (particules d\'un diamètre inférieur à 2,5µm)</b>',
    yaxis: {
        title: {
            text: '<b>PM<sub>2,5</sub> μg/m3</b>',
        },
    },
});