import { notEqual } from "assert";
import { Router, Request, Response } from "express";
import { User, Note } from "../models/index";

const router = Router();

export const users: User[] = [];
export const notes: Note[] = [];

router.post("/users", (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: "Dados obrigatórios não registrados",
    });
  } else {
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return res.status(404).json({
        success: false,
        message: "Email já esta em uso!",
      });
    }
    const user = new User(username, password, email);
    users.push(user);
    return res.status(200).json({
      success: true,
      data: user,
    });
  }
});

router.post("/users/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = users.some(
    (user) => user.email === email && user.password === password
  );

  if (userExists) {
    return res.status(201).json({
      success: true,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Usuário ou senha incorretos",
    });
  }
});

router.post("/users/notes", (req: Request, res: Response) => {
  const { email, title, description } = req.body;

  const userExists = users.some((user) => user.email === email);

  if (!userExists) {
    return res.status(401).json({
      success: false,
      message: "Recados não encontrados!",
    });
  } else {
    const note = new Note(title, email, description);
    notes.push(note);
    return res.status(200).json({
      success: true,
      data: note,
    });
  }
});

router.get("/users/notes", (req: Request, res: Response) => {
  const { email } = req.query;

  const userExists = users.some((user) => user.email === email);
  if (!userExists) {
    return res.status(401).json({
      success: false,
      message: "Usuário não encontrado!",
    });
  } else {
    const userNotes = notes.filter((note) => note.userEmail === email);
    return res.status(200).json({
      success: true,
      data: userNotes,
    });
  }
});

router.put("/users/notes/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const noteIndex = notes.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Nota não encontrada!",
    });
  } else {
    notes[noteIndex].title = title;
    notes[noteIndex].description = description;
    return res.status(200).json({
      success: true,
      data: notes[noteIndex],
    });
  }
});

router.delete("/users/notes/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const noteIndex = notes.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Nota não encontrada!",
    });
  } else {
    notes.splice(noteIndex, 1);
    return res.status(200).json({
      success: true,
      message: "Nota excluída com sucesso!",
    });
  }
});

export default router;
