const fs = require("fs");
const router = require("express").Router();
const Flashcard = require("../models/User");
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  // generate a JWT token
  let privateKey = fs.readFileSync("./keys/pri.key");
  let token = jwt.sign(
    {
      data: user,
    },
    privateKey,
    { expiresIn: 604800, algorithm: "RS256" }
  );
  return token;
};

router.post("/register", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({ username: username });

    // Check if username or password is valid
    if (!username || !password) {
      res.status(400).send({ msg: "Missing username or password!" });
    } else if (user) {
      res.status(400).send({ msg: "Username exists!" });
    } else {
      // Create user
      let user = await User.create({ username: username, password: password });
      let jwt = generateJWT(user);
      res.status(200).send({ msg: "Success", jwt: jwt });
    }
  } catch (error) {
    res.status(400).send({ msg: error.toString() });
  }
});

router.post("/auth", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.findOne({ username: username });
    let passwordMatch = password === user.password;

    if (!username || !password)
      res.status(400).send({ msg: "Missing username or password!" });
    else if (!user) res.status(400).send({ msg: "Username doesn't exist!" });
    else if (!passwordMatch)
      res.status(400).send({ msg: "Password doesn't match!" });
    else {
      let jwt = generateJWT(user);
      res.status(200).send({ msg: "Success", jwt: jwt });
    }
  } catch (error) {
    res.status(400).send({ msg: error.toString() });
  }
});

module.exports = router;
