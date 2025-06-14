import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshToken: string;

type User = {
  id: string;
  name: string;
  surname: string;
  password: string;
  role: "admin" | "devops" | "developer" | "guest";
  googleId?: string;
  email?: string;
};

const users: User[] = [
  {
    id: "admin",
    name: "admin",
    surname: "admin",
    role: "admin",
    password: "admin",
  },
  {
    id: "developer",
    name: "developer",
    surname: "developer",
    role: "developer",
    password: "developer",
  },
  {
    id: "devops",
    name: "devops",
    surname: "devops",
    role: "devops",
    password: "devops",
  },
];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World - simple api with JWT!");
});

app.post("/login", (req, res) => {
  const { name, surname, password, googleId } = req.body;

  const user = users.find(
    (user) =>
      user.name === name &&
      user.surname === surname &&
      user.password === password &&
      (!user.googleId || user.googleId === googleId)
  );
  if (!user) {
    res.status(400).send();
    return;
  }

  const expTime = 120;
  const token = generateToken(expTime);
  refreshToken = generateToken(60 * 60);
  res.status(200).send({ user, token, refreshToken });
});

app.post("/register", (req, res) => {
  const { name, surname, password, googleId, email } = req.body;

  const existingUser = users.find(
    (user) => user.name === name && user.surname === surname
  );
  if (existingUser) {
    res.status(400).send("Duplicate user!");
    return;
  }

  const role = googleId ? "guest" : "developer";

  const newUser: User = {
    name,
    surname,
    password,
    role,
    googleId,
    email,
    id: crypto.randomUUID(),
  };

  users.push(newUser);

  const expTime = 120;
  const token = generateToken(expTime);
  refreshToken = generateToken(60 * 60);
  res.status(200).send({ token, refreshToken, user: newUser });
});

app.post("/refreshToken", function (req, res) {
  const refreshTokenFromPost = req.body.refreshToken;
  if (refreshToken !== refreshTokenFromPost) {
    res.status(400).send("Bad refresh token!");
    return;
  }
  const expTime = 120;
  const token = generateToken(expTime);
  refreshToken = generateToken(60 * 60);
  res.status(200).send({ token, refreshToken });
});
app.get("/protected/:id/:delay?", verifyToken, (req, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`);
  }, delay);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateToken(expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ exp, foo: "bar" }, tokenSecret, {
    algorithm: "HS256",
  });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user;
    next();
  });
}
