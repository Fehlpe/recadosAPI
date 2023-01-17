"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notes = exports.users = void 0;
const express_1 = require("express");
const index_1 = require("../models/index");
const router = (0, express_1.Router)();
exports.users = [];
exports.notes = [];
router.post("/users", (req, res) => {
    const { username, password, password2, email } = req.body;
    if (password !== password2) {
        return res.status(401).json({
            success: false,
            message: "Passwords are different",
        });
    }
    else {
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "Required fields not filled",
            });
        }
        else {
            const emailExists = exports.users.some((user) => user.email === email);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use!",
                });
            }
            const user = new index_1.User(username, password, email);
            exports.users.push(user);
            return res.status(200).json({
                success: true,
                data: user,
            });
        }
    }
});
router.post("/users/login", (req, res) => {
    const { email, password } = req.body;
    const userExists = exports.users.some((user) => user.email === email && user.password === password);
    if (userExists) {
        return res.status(201).json({
            success: true,
        });
    }
    else {
        return res.status(404).json({
            success: false,
            message: "Incorrect username or password",
        });
    }
});
router.post("/users/notes", (req, res) => {
    const { userEmail, title, description } = req.body;
    const userExists = exports.users.some((user) => user.email === userEmail);
    if (!userExists) {
        return res.status(418).json({
            success: false,
            message: "Notes not found!",
        });
    }
    else {
        const note = new index_1.Note(title, userEmail, description);
        exports.notes.push(note);
        return res.status(200).json({
            success: true,
            data: note,
        });
    }
});
router.get("/users/notes", (req, res) => {
    const { userEmail } = req.query;
    const userExists = exports.users.some((user) => user.email === userEmail);
    if (!userExists) {
        return res.status(418).json({
            success: false,
            message: "User not found!",
        });
    }
    else {
        const userNotes = exports.notes.filter((note) => note.userEmail === userEmail);
        return res.status(200).json({
            success: true,
            data: userNotes,
        });
    }
});
router.put("/users/notes/:id", (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const noteIndex = exports.notes.findIndex((note) => note.id == id);
    if (noteIndex == -1) {
        return res.status(418).json({
            success: false,
            message: "Note not found!",
        });
    }
    else {
        exports.notes[noteIndex].title = title;
        exports.notes[noteIndex].description = description;
        return res.status(200).json({
            success: true,
            data: exports.notes[noteIndex],
        });
    }
});
router.put("/:userEmail/notes/:id/archive", (req, res) => {
    const { id, userEmail } = req.params;
    const noteIndex = exports.notes.findIndex((note) => note.id == id);
    if (noteIndex == -1) {
        return res.status(404).json({
            success: false,
            message: "Note not found!",
        });
    }
    else {
        exports.notes[noteIndex].archived = true;
        const userNotes = exports.notes.filter((note) => note.userEmail === userEmail);
        return res.status(200).json({
            success: true,
            data: userNotes,
        });
    }
});
router.put("/:userEmail/notes/:id/unarchive", (req, res) => {
    const { id, userEmail } = req.params;
    const noteIndex = exports.notes.findIndex((note) => note.id == id);
    if (noteIndex == -1) {
        return res.status(404).json({
            success: false,
            message: "Note not found!",
        });
    }
    else {
        exports.notes[noteIndex].archived = false;
        const userNotes = exports.notes.filter((note) => note.userEmail === userEmail);
        return res.status(200).json({
            success: true,
            data: userNotes,
        });
    }
});
router.delete("/users/notes/:id", (req, res) => {
    const { id } = req.params;
    const note = exports.notes.find((note) => note.id == id);
    if (!note) {
        return res.status(418).json({
            success: false,
            message: "Note not found!",
        });
    }
    else {
        const noteIndex = exports.notes.findIndex((n) => n == note);
        exports.notes.splice(noteIndex, 1);
        return res.status(200).json({
            success: true,
            data: exports.notes,
            message: "Note deleted successfully!",
        });
    }
});
router.get("/:userEmail/notes/search", (req, res) => {
    const { userEmail } = req.params;
    const { query } = req.query;
    console.log(userEmail);
    const userNotes = exports.notes.filter((note) => note.userEmail === userEmail);
    //@ts-ignore
    const searchResults = userNotes.filter((note) => note.title.includes(query));
    if (searchResults.length === 0) {
        return res.status(201).json({
            success: true,
            data: userNotes,
        });
    }
    else {
        return res.status(200).json({
            success: true,
            data: searchResults,
        });
    }
});
exports.default = router;
