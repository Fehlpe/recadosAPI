import { Router, Request, Response } from "express";
import { User, Note } from "../models/index";

const router = Router();

export const users: User[] = [];
export const notes: Note[] = [];

router.post("/users", (req: Request, res: Response) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
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
    const user = new User(name, password, email);
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

export default router;
