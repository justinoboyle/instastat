import program from 'commander';

export default () => program
    .version(global.pkg.version)
    .usage('[options]')
    .description(global.pkg.description)
    .option('--init', 'Interactive authfile generator.')
    .option('-u, --user <n>', 'Specify a user to be the property to perform actions upon.')
    .option('--export <n>', 'Export a specific subproperty from the property selected.')
    .option('--format <n>', 'Specify the format to use to export the data into stdout. (json/csv)', /^(json|csv)$/i)