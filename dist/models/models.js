"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
exports.User = User;
class Note {
    constructor(title, userEmail, description) {
        this.id = (0, uuid_1.v4)();
        this.userEmail = userEmail;
        this.title = title;
        this.description = description;
        this.archived = false;
    }
}
exports.Note = Note;
