import { v4 } from "uuid";

export class User {
  username: string;
  password: string;
  email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

export class Note {
  userEmail: string;
  id: string;
  title: string;
  description: string;

  constructor(title: string, userEmail: string, description: string) {
    this.id = v4();
    this.userEmail = userEmail;
    this.title = title;
    this.description = description;
  }
}
