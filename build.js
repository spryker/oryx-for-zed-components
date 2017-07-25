const oryx = require('@spryker/oryx');
const api = require('./lib');
const configuration = api.getConfiguration(api.settings);

oryx.build(configuration);
