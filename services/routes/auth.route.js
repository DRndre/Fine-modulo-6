import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { authMiddleware, generateJWT } from "../auth/index.js";

export const authRouter = Router();

authRouter.get("/", async (req, res, next) => {
  res.send("Login Page");
});

authRouter.post("/register", async (req, res, next) => {
  try {
    let user = await User.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
    });


    res.send(user);
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    let userFound = await User.findOne({
      username: req.body.username,
    });

    if (userFound) {
      const isPasswordMatching = await bcrypt.compare(
        req.body.password,
        userFound.password
      );

      if (isPasswordMatching) {
        const token = await generateJWT({
          username: userFound.username,
        });

        res.send({ user: userFound, token });
      } else {
        res.status(400).send("Password sbagliata");
      }
    } else {
      res.status(400).send("Utente non trovato");
    }
  } catch (err) {
    next(err);
  }
});

authRouter.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);

    res.send(user);
  } catch (err) {
    next(err);
  }
});
