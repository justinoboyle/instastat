// import 'babel-polyfill';
import 'babel-regenerator-runtime';
import 'colors';
import commander from 'commander';
import pkg from '../package';
import commands from './command';
import init from './tools/init';
import path from 'path';
import homedir from 'homedir';
import fs from 'fs-promise';
import formatter from './formatter';
import PrivateClient from './client/PrivateClient';
import PublicClient from './client/PublicClient';

global.pkg = pkg;

let program = commands().parse(process.argv);
let client;
try {
    (async () => {

        if (program.init)
            return await init();

        let authfileLocation = program.auth || process.env['ISTAT-AUTH'] || path.join(homedir(), 'istat-auth.json');

        if (!await fs.exists(authfileLocation)) {
            console.log('The auth file at ' + authfileLocation.blue + ' does not exist.');
            console.log('Hint: use ' + 'instastat --init'.green + ' to generate one.');
            return process.exit(1);
        }

        let authfileContents = JSON.parse(await fs.readFile(authfileLocation));
        let isPub = isPublic(authfileContents);
        client = isPub ? new PublicClient(authfileContents) : new PrivateClient(authfileLocation, authfileContents['i.instagram.com']['/']['ds_user']['value']);

        await client.login();

        let target = await client.getSelfAccount();

        if (program.user)
            if (program.user.startsWith('@'))
                target = await client.getAccountByUsername(program.user.substring(1));
            else
                target = await client.getAccountByUsername(program.user);

        let outputOption = program.export || 'self';
        let formatOption = program.format || 'json';

        try {
            let output = await client.output(target, outputOption);

            let format = await formatter(output, formatOption);
            process.stdout.write(format);
            process.exit(0);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

    })();
} catch (e) {
    console.error(e);
}
function isPublic(file) {
    return file.type && file.type == 'public';
}