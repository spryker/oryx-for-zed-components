const path = require('path');
const oryx = require('@spryker/oryx');
const argv = require('yargs').argv;

const rootDir = process.cwd();
const publicPath = '/assets/';
const publicDir = path.resolve(path.join('public/Zed', publicPath));

const settings = {
    options: {
        isProduction: !!argv.prod,
        isWatching: !!argv.dev,
        isVerbose: !!argv.verbose
    },

    paths: {
        rootDir,
        publicPath,
        publicDir
    },

    projectNamespace: {
        dirs: [
            path.resolve('./')
        ],
        patterns: [
            '**/GuiComponentCollection/Presentation/App',
            '!**/src/Spryker/Zed/GuiComponentCollection/Presentation/App'
        ],
        description: 'loading project namespace...'
    },

    sprykerNamespace: {
        dirs: [
            path.resolve('./')
        ],
        patterns: [
            '**/src/Spryker/Zed/GuiComponentCollection/Presentation/App'
        ],
        description: 'loading Spryker namespace...'
    }
}

module.exports = settings;
