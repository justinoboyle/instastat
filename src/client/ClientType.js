export default class ClientType {

    async getSelfAccount() { }
    async getFollowersList(account) { }
    async getFollowingList(account) { }
    async getAccountById(id) { }
    async getAccountByUsername(username) { }

    async output(target, type) {
        switch (type) {
            case 'self': return [this.exportAccountData(target)];
            case 'followers': return (await this.getFollowersList(target)).map(this.exportAccountData);
            case 'following': return (await this.getFollowingList(target)).map(this.exportAccountData);
            default: return {};
        }
    }

    exportAccountData(self) {
        return {
            id: self.id || 0,
            username: self.username || "",
            fullname: self.fullName || "",
            private: self.isPrivate || false,
            business: self.is_business || false,
            anonymous_profile: self.hasAnonymousProfilePicture || false,
            verified: self.is_verified || false,
            follower_count: self.followerCount || 0,
            following_count: self.followingCount || 0,
            media_count: self.mediaCount || 0,
            url: self.url || "",
            byline: self.byLine || "",
            biography: self.biography || "",
            mutualFollowersCount: self.mutualFollowersCount || 0,
            usertagsCount: self.usertagsCount || 0,
            profile_pic_id: self.profilePicId || ""
        }
    }

}