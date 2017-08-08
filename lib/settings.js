const path = require('path');
const oryx = require('@spryker/oryx');
const argv = require('yargs').argv;

const rootDir = process.cwd();
const publicPath = '/assets/';
const publicDir = path.resolve(path.join('public/Zed', publicPath));
const projectAppPath = 'src/Pyz/Zed/GuiComponentCollection/Presentation/App';
const projectAppDir = path.join(rootDir, projectAppPath);
const sprykerAppPath = 'src/Spryker/Zed/GuiComponentCollection/Presentation/App';
const sprykerAppDir = path.join(rootDir, sprykerAppPath);

const settings = {
    options: {
        isProduction: !!argv.prod,
        isWatching: !!argv.dev,
        isVerbose: !!argv.verbose
    },

    paths: {
        rootDir,
        publicPath,
        publicDir,
        projectAppPath,
        projectAppDir,
        sprykerAppPath,
        sprykerAppDir
    },

    entry: {
        dirs: [
            path.resolve('./vendor/spryker'),
            path.resolve('./src')
        ],
        patterns: [
            '**/GuiComponentCollection/Presentation/App/*.ts'
        ],
        description: 'loading Zed UI App entry points...',
        defineName: filename => path.basename(filename, '.ts')
    },

    resolveModules: {
        dirs: [
            path.resolve('./vendor/spryker')
        ],
        patterns: [
            '**/gui-component-collection',
            '**/Bundles/GuiComponentCollection'
        ],
        description: 'loading modules source folders...'
    }
}

module.exports = settings;
