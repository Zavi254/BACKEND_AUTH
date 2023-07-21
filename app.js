const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

app.use(express.json());

const port = 3000;

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => res.send("Hello World!"));

// register endpoint
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // hash the password
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        .then((result) => {
          res
            .status(201)
            .send({ message: "User created Successfully", result });
        })
        .catch((error) => {
          res.status(500).send({ message: "Error creating user", error });
        });
    })
    .catch((e) => {
      res.status(500).send({ message: "Password was not hashed successfully" });
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res
              .status(400)
              .send({ message: "Passwords does not match", error });
          }

          //   create JWT token
          const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          // return success response
          res.status(200).send({
            message: "Login Successful",
            token,
          });
        })
        .catch((error) => {
          res.status(400).send({ message: "Passwords does not match", error });
        });
    })
    .catch((e) => {
      res.status(404).send({ message: "Email not found", e });
    });
});

// free endpoint
app.get("/free-endpoint", (req, res) => {
  res.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (req, res) => {
  res.json({ message: "You are authorized to access me" });
});

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${port}!`));
