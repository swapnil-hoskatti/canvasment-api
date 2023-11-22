const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3000";

const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.find()
    .select("firstName lastName email role")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,
            role: doc.role,
            _id: doc._id,
            userImage: doc.userImage,
            request: {
              type: "GET",
              url: "http://" + HOST + ":" + PORT + "/api/users/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.createUser = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              // userImage: req.file.path,
              email: req.body.email,
              password: hash,
              role: req.body.role,
            });
            newUser
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                  request: {
                    type: "GET",
                    url:
                      "http://" +
                      HOST +
                      ":" +
                      PORT +
                      "/api/users/" +
                      result._id,
                  },
                });
              })
              .catch((err) => {
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
};

exports.loginUser = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              role: user[0].role,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "8h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            role: user[0].role,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("firstName lastName email role")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          role: doc.role,
          _id: doc._id,
          userImage: doc.userImage,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.updateUser = (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.updateOne({ _id: req.params.userId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User updated",
        request: {
          type: "GET",
          url: "http://" + HOST + ":" + PORT + "/api/users/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      } else {
        User.deleteOne({ _id: id })
          .exec()
          .then((result) => {
            res.status(200).json({
              message: "User deleted",
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    });
};
