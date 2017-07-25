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

    entry: {
        dirs: [
            path.resolve('./vendor/spryker')
        ],
        patterns: [
            '**/Presentation/App/main.ts'
        ],
        description: 'looking for Zed UI App entry points...',
        defineName: filename => path.basename(filename, '.ts')
    },

    resolveModules: {
        dirs: [
            path.resolve('./vendor/spryker')
        ],
        patterns: [
            '**/gui-component-collection',
            '**/GuiComponentCollection'
        ],
        description: 'looking for modules source folders...'
    }
}

module.exports = settings;
