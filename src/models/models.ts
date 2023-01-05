import { v4 } from "uuid";

export class User {
  id: number | string;
  name: string;
  password: string;
  email: string;

  constructor(name: string, password: string, email: string) {
    this.id = v4();
    this.name = name;
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
