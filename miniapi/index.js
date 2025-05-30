"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
var port = 3000;
var tokenSecret = process.env.TOKEN_SECRET;
var refreshToken;
var users = [
    {
        id: "sillyHippoAdmin",
        name: "Hipa",
        surname: "Dripa",
        role: "admin",
        password: "123",
    },
];
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello World - simple api with JWT!");
});
app.post("/login", function (req, res) {
    var _a = req.body, name = _a.name, surname = _a.surname, password = _a.password, googleId = _a.googleId;
    var user = users.find(function (user) {
        return user.name === name &&
            user.surname === surname &&
            user.password === password &&
            (!user.googleId || user.googleId === googleId);
    });
    if (!user) {
        res.status(400).send();
        return;
    }
    var expTime = 120;
    var token = generateToken(expTime);
    refreshToken = generateToken(60 * 60);
    res.status(200).send({ user: user, token: token, refreshToken: refreshToken });
});
app.post("/register", function (req, res) {
    var _a = req.body, name = _a.name, surname = _a.surname, password = _a.password, googleId = _a.googleId;
    var existingUser = users.find(function (user) { return user.name === name && user.surname === surname; });
    if (existingUser) {
        res.status(400).send();
        return;
    }
    var role = googleId ? "guest" : "developer";
    var newUser = {
        name: name,
        surname: surname,
        password: password,
        role: role,
        googleId: googleId,
        id: crypto.randomUUID(),
    };
    users.push(newUser);
    var expTime = 120;
    var token = generateToken(expTime);
    refreshToken = generateToken(60 * 60);
    res.status(200).send({ token: token, refreshToken: refreshToken, user: newUser });
});
app.post("/refreshToken", function (req, res) {
    var refreshTokenFromPost = req.body.refreshToken;
    if (refreshToken !== refreshTokenFromPost) {
        res.status(400).send("Bad refresh token!");
        return;
    }
    var expTime = 120;
    var token = generateToken(expTime);
    refreshToken = generateToken(60 * 60);
    res.status(200).send({ token: token, refreshToken: refreshToken });
});
app.get("/protected/:id/:delay?", verifyToken, function (req, res) {
    var id = req.params.id;
    var delay = req.params.delay ? +req.params.delay : 1000;
    setTimeout(function () {
        res.status(200).send("{\"message\": \"protected endpoint ".concat(id, "\"}"));
    }, delay);
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
function generateToken(expirationInSeconds) {
    var exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
    var token = jsonwebtoken_1.default.sign({ exp: exp, foo: "bar" }, tokenSecret, {
        algorithm: "HS256",
    });
    return token;
}
function verifyToken(req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(token, tokenSecret, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(401).send(err.message);
        }
        req.user = user;
        next();
    });
}
