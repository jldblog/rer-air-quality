declare var require: any

export const environment = {
    production: true,
    enableDebug: false,
    url: require('../../package.json').url,
    name: require('../../package.json').name,
    version: require('../../package.json').version,
};
