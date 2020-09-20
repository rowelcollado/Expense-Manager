export default class Gate {
    constructor(user) {
        this.user = user;
    }

    isAdmin() {
        return this.user.role_id === 'admin';
    }

    isUser() {
        return this.user.role_id === 'user';
    }
}