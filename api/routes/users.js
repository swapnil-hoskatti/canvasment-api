const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user");

router.get("/", (req, res, next) => {
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
            request: {
              type: "GET",
              url: "http://localhost:3000/users/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  newUser
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        createdUser: {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/users/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("firstName lastName email role")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          role: doc.role,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:userId", (req, res, next) => {
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
          url: "http://localhost:3000/users/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
