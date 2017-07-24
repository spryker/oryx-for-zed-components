const oryx = require('@spryker/oryx');
const api = require('./lib');
const guiConfig = api.getGuiConfig(api.settings);

oryx.build(guiConfig);
