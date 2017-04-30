import inquirer from 'inquirer';
import path from 'path';
import homedir from 'homedir';
import { V1 as PrivateClient } from 'instagram-private-api';
import ora from 'ora';
import fs from 'fs-promise';
import PublicClient from 'instagram-node';
import express from 'express';
import colors from 'colors';
import portscanner from 'portscanner';

export default function () {
    return new Promise(async (resolve, reject) => {
        let answers = await askQuestions();
        try {
            //await writeToFile(answers);
            resolve(answers);
        } catch (e) {
            reject(e);
        }
    });
}

async function askQuestions() {
    let { location } = await inquirer.prompt({
        type: 'input',
        name: 'location',
        message: 'Where should the file be output?',
        default: path.join(homedir(), 'istat-auth.json')
    });

    let exists = await fs.exists(location);

    if (exists) {
        let { cont } = await inquirer.prompt({
            type: 'confirm',
            name: 'cont',
            message: 'That file already exists. Overwrite?',
            default: true
        });
        if (!cont)
            process.exit(-1);
    }

    let { api } = await inquirer.prompt({
        type: 'list',
        name: 'api',
        message: 'Do you want to use the public (supported, more limited) or private (unsupported) API?',
        default: 'public',
        choices: ['public', 'private']
    });

    let auth;
    if (api == 'public')
        auth = await authenticatePublicAPI(location);
    else
        auth = await authenticatePrivateAPI(location);
}

async function authenticatePublicAPI(location) {
    console.log("App authentication".blue.bold + "\n")
    let port = await getEmptyPort();
    console.log(port);
    console.log("First, visit " + "https://www.instagram.com/developer/clients/manage/".blue + " and register a client.\n");
    console.log("You can use tester information if you are not releasing any software to the public.\n");
    console.log(`IMPORTANT: Make sure to set the website and redirect fields to http://localhost:${port} as well as uncheck "disable implicit OAuth" in the Security tab!`.red.bold + '\n\nOnce you are done, click Manage and insert the CLIENT_ID and CLIENT_SECRET below:\n');
    let { CLIENT_ID, CLIENT_SECRET } = await inquirer.prompt([{
        type: 'input',
        name: 'CLIENT_ID',
        message: 'Client ID:'
    }, {
        type: 'password',
        name: 'CLIENT_SECRET',
        message: 'Client Secret:'
    }]);


    console.log("Please visit " + `http://localhost:${port}`.blue + " in your browser to authenticate.")
    let spinner = ora('Waiting for confirmation.').start();
    let ACCESS_TOKEN = await setupAuthentication(CLIENT_ID, CLIENT_SECRET, port);
    spinner.stop();
    console.log("Recieved access token.");
    await fs.writeFile(location, JSON.stringify({ type: 'public', CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN }));
    console.log('Saved and written to file.');
}

function setupAuthentication(id, secret, port) {
    return new Promise(resolve => {
        const app = express();
        app.get('/register', (req, res) => res.redirect(`https://instagram.com/oauth/authorize/?client_id=${id}&redirect_uri=http://localhost:${port}&response_type=token`));
        let server = app.listen(port);
        let token = "";
        app.get('/', (req, res) => res.send(`
        <script>
        if(!window.location.hash) window.location.href="https://instagram.com/oauth/authorize/?client_id=${id}&redirect_uri=http://localhost:${port}&response_type=token"
        else window.location.href="/assign/" + window.location.hash.substring("#access_token=".length)
        </script>`))
        app.get('/assign/:value', (req, res) => {
            token = req.params.value;
            setTimeout(() => {
                resolve(token);
                server.close();
            }, 100);
            res.redirect('/success');
        });
        app.get('/success', (req, res) => res.send("<style>* { font-family: monospace; }</style>All good! Feel free to close this window and head back to your command line."))
    })
}

function getEmptyPort() {
    return new Promise(resolve => {
        portscanner.findAPortNotInUse(3000, 65535, '127.0.0.1', function (error, port) {
            resolve(port)
        })
    })
}

async function authenticatePrivateAPI(location) {
    let { username, password } = await inquirer.prompt([{
        type: 'input',
        name: 'username',
        message: 'Username:',
    },
    {
        type: 'password',
        message: 'Password:',
        name: 'password'
    }]);
    const spinner = ora('Testing login...').start();
    let device = new PrivateClient.Device(username);
    if (await fs.exists(location))
        await fs.unlink(location);
    let storage = new PrivateClient.CookieFileStorage(location);
    let session = await PrivateClient.Session.create(device, storage, username, password);
    spinner.stop();
    console.log('Saved and written to file.');
    setTimeout(process.exit, 10);

}