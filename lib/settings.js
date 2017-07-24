const fs = require('fs');
const path = require('path');
const oryx = require('@spryker/oryx');
const argv = require('yargs').argv;

const isVerbose = !!argv.verbose;

const rootDir = process.cwd();
const sourcePath = './assets/Zed/';
const publicPath = '/assets/';
const sourceDir = path.resolve(sourcePath);
const publicDir = path.resolve(path.join('public/Zed', publicPath));

let bundlesPath = './vendor/spryker/';
let guiComponentCollectionFolder = 'gui-component-collection';

if (!fs.existsSync(path.resolve(bundlesPath, guiComponentCollectionFolder))) {
    oryx.log.step('spryker core: no-bundle-split layout detected');

    bundlesPath = './vendor/spryker/spryker/Bundles/';
    guiComponentCollectionFolder = 'GuiComponentCollection';
}

const bundlesDir = path.resolve(bundlesPath);

const settings = {
    options: {
        isProduction: !!argv.prod,
        isWatching: !!argv.dev,
        isVerbose
    },

    paths: {
        guiComponentCollectionFolder,
        sourcePath,
        publicPath,
        bundlesPath,
        rootDir,
        sourceDir,
        publicDir,
        bundlesDir
    },

    entry: {
        dirs: [
            path.resolve('./vendor/spryker')
        ],
        patterns: [
            '**/*.zed.ts'
        ],
        description: 'looking for entry points...'
    },

    resolveModules: {
        dirs: [
            path.resolve('./vendor/spryker')
        ],
        patterns: [
            '**/gui-component-collection',
            '**/GuiComponentCollection'
        ],
        description: 'resolving gui component collection deps...'
    }
}

module.exports = settings;
