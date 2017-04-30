import { V1 as Client } from 'instagram-private-api';
import ClientType from './ClientType';

export default class PrivateClient extends ClientType {
    constructor(path, username) {
        super();
        this.device = new Client.Device(username);
        this.storage = new Client.CookieFileStorage(path);
    }

    async getFollowersList(account) {
        let id = account.id;
        let feed = new Client.Feed.AccountFollowers(this.session, id);
        let get = await feed.get();
        return get.map(i => i.params);
    }

    async getFollowingList(account) {
        let id = account.id;
        let feed = new Client.Feed.AccountFollowing(this.session, id);
        let get = await feed.get();
        return get.map(i => i.params);
    }

    login() {
        return new Promise(resolve => {
            Client.Session.create(this.device, this.storage).then((session) => {
                this.session = session;
                resolve();

            })
        })

    }

    async getSelfAccount() {
        return await this.session.getAccount();
    }
    async getAccountById(id) {
        return (await Client.Account.getById(this.session, id)).params;
    }
    async getAccountByUsername(username) {
        return (await Client.Account.searchForUser(this.session, username)).params;
    }
}