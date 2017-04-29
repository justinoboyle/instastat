// import 'babel-polyfill';
import 'babel-regenerator-runtime';
import commander from 'commander';
import pkg from '../package';
import commands from './command';

global.pkg = pkg;

let program = commands().parse(process.argv);

