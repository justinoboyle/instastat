// import 'babel-polyfill';
import 'babel-regenerator-runtime';
import commander from 'commander';
import pkg from '../package';
import commands from './command';
import init from './tools/init';

global.pkg = pkg;

let program = commands().parse(process.argv);

(async () => {

    if (program.init)
        return await init();

})();