import { v4 } from "uuid";

export class User {
  id: number | string;
  username: string;
  password: string;
  email: string;

  constructor(username: string, password: string, email: string) {
    this.id = v4();
    this.username = username;
    this.password = password;
    this.email = email;
  }
}

export class Note {
  userId: string;
  id: number | string;
  title: string;
  description: number;

  constructor(title: string, userId: string, description: number) {
    this.id = v4();
    this.userId = userId;
    this.title = title;
    this.description = description;
  }
}
