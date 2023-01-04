import { v4 } from "uuid";

export class User {
  id: number | string;
  name: string;
  password: string;
  email: string;
  notes: Note[];

  constructor(name: string, password: string, email: string) {
    this.id = v4();
    this.name = name;
    this.password = password;
    this.email = email;
    this.notes = [];
  }
}

export class Note {
  id: number | string;
  title: string;
  description: number;

  constructor(title: string, description: number) {
    this.id = v4();
    this.title = title;
    this.description = description;
  }
}
