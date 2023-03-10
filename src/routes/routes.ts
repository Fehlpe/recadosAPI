import { notEqual } from "assert";
import { Router, Request, Response } from "express";
import { User, Note } from "../models/index";

const router = Router();

export const users: User[] = [];
export const notes: Note[] = [];

router.post("/users", (req: Request, res: Response) => {
  const { username, password, password2, email } = req.body;

  if (password !== password2) {
    return res.status(401).json({
      success: false,
      message: "Passwords are different",
    });
  } else {
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields not filled",
      });
    } else {
      const emailExists = users.some((user) => user.email === email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use!",
        });
      }
      const user = new User(username, password, email);
      users.push(user);
      return res.status(200).json({
        success: true,
        data: user,
      });
    }
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
    return res.status(404).json({
      success: false,
      message: "Incorrect username or password",
    });
  }
});

router.post("/users/notes", (req: Request, res: Response) => {
  const { userEmail, title, description } = req.body;

  const userExists = users.some((user) => user.email === userEmail);

  if (!userExists) {
    return res.status(418).json({
      success: false,
      message: "Notes not found!",
    });
  } else if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Missing info",
    });
  } else {
    const note = new Note(title, userEmail, description);
    notes.push(note);
    return res.status(200).json({
      success: true,
      data: note,
    });
  }
});

router.get("/users/notes", (req: Request, res: Response) => {
  const { userEmail } = req.query;

  const userExists = users.some((user) => user.email === userEmail);
  if (!userExists) {
    return res.status(418).json({
      success: false,
      message: "User not found!",
    });
  } else {
    const userNotes = notes.filter((note) => note.userEmail === userEmail);
    return res.status(200).json({
      success: true,
      data: userNotes,
    });
  }
});

router.put("/users/notes/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const noteIndex = notes.findIndex((note) => note.id == id);
  if (noteIndex == -1) {
    return res.status(418).json({
      success: false,
      message: "Note not found!",
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

router.put("/:userEmail/notes/:id/archive", (req: Request, res: Response) => {
  const { id, userEmail } = req.params;

  const noteIndex = notes.findIndex((note) => note.id == id);
  if (noteIndex == -1) {
    return res.status(404).json({
      success: false,
      message: "Note not found!",
    });
  } else {
    notes[noteIndex].archived = true;
    const userNotes = notes.filter((note) => note.userEmail === userEmail);
    return res.status(200).json({
      success: true,
      data: userNotes,
    });
  }
});

router.put("/:userEmail/notes/:id/unarchive", (req: Request, res: Response) => {
  const { id, userEmail } = req.params;

  const noteIndex = notes.findIndex((note) => note.id == id);
  if (noteIndex == -1) {
    return res.status(404).json({
      success: false,
      message: "Note not found!",
    });
  } else {
    notes[noteIndex].archived = false;
    const userNotes = notes.filter((note) => note.userEmail === userEmail);
    return res.status(200).json({
      success: true,
      data: userNotes,
    });
  }
});

router.delete("/users/notes/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const note = notes.find((note) => note.id == id);
  if (!note) {
    return res.status(418).json({
      success: false,
      message: "Note not found!",
    });
  } else {
    const noteIndex = notes.findIndex((n) => n == note);
    notes.splice(noteIndex, 1);
    return res.status(200).json({
      success: true,
      data: notes,
      message: "Note deleted successfully!",
    });
  }
});

router.get("/:userEmail/notes/search", (req: Request, res: Response) => {
  const { userEmail } = req.params;
  const { query } = req.query;

  console.log(userEmail);

  const userNotes = notes.filter((note) => note.userEmail === userEmail);

  //@ts-ignore
  const searchResults = userNotes.filter((note) => note.title.includes(query));

  if (searchResults.length === 0) {
    return res.status(201).json({
      success: true,
      data: userNotes,
    });
  } else {
    return res.status(200).json({
      success: true,
      data: searchResults,
    });
  }
});

export default router;
