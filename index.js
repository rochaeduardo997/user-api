const jwt = require('jsonwebtoken');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const jwtSecret = "ThisIsSecretOk";

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

function auth(req, res, next) {
  const authToken = req.headers['authorization'];

  if (authToken != undefined) {
    const bearerToken = authToken.split(' ');
    const token = bearerToken[1];

    jwt.verify(token, jwtSecret, (error, data) => {
      if (error) {
        res.status(401).json({
          error: "Invalid token"
        });

        return console.log("error: Invalid token");
      } else {
        console.log("success: Token is valid");

        req.loggedUser = {
          id: data.id,
          username: data.username,
        }

        next();
      }
    });
  } else {
    res.status(401).json({
      error: "Token not found"
    });

    return console.log("error: Token not found");
  }
}

var DB = {
  users: [{
    id: 23,
    username: "eduardo",
    email: "eduardo@email.com",
    password: "123456",
  },
  {
    id: 27,
    username: "carlos",
    email: "carlos@email.com",
    password: "654321",
  },
  {
    id: 45,
    username: "rocha",
    email: "rocha@email.com",
    password: "123123",
  }],
}

//return all sers
app.get("/users", auth, (req, res) => {
  if (DB.users.length <= 0) {
    res.status(200).json({
      success: "There is no users yet"
    });

    return console.log("success: There is no users yet");
  }
  res.status(200).json(DB.users);
  console.log(req.loggedUser);
  console.log(DB.users);
});

//return user by id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({
      error: "Invalid type of data"
    });

    return console.log("error: Invalid type of data");
  } else {
    var resultUser = DB.users.find(user => user.id === parseInt(id));

    if (resultUser != undefined) {
      res.status(200).json(resultUser);

      return console.log(resultUser);
    } else {
      res.status(404).json({
        error: "User not found",
      });

      return console.log("error: User not found");
    }
  }
});

//insert user
app.post("/user", (req, res) => {
  const { id, username, email } = req.body;

  //verify id
  if (id != undefined && isNaN(id)) {
    res.status(400).json({
      error: "Invalid ID"
    });

    return console.log("error: Invalid ID")
  }

  //verify first name
  if (username == undefined || username == "") {
    res.status(400).json({
      error: "First name cannot be null"
    });

    return console.log("error: First name cannot be null");
  }

  //verify last name
  if (email == undefined || email == "") {
    res.status(400).json({
      error: "Last name cannot be null"
    });

    return console.log("error: Last name cannot be null");
  }

  DB.users.push({
    id,
    username,
    email,
  });

  let resultUser = DB.users.find(user => user.id === id);

  res.status(200).json({
    success: "User has been created"
  });

  return console.log("success: User has been created\n", resultUser);
});

//delete user
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({
      error: "Invalid type of data"
    });

    return console.log("error: Invalid type of data");
  }

  let userId = DB.users.findIndex(user => user.id === parseInt(id));
  console.log(userId);

  if (userId != undefined && userId != -1) {
    DB.users.splice(userId, 1);

    res.status(200).json({
      success: "User has been deleted"
    });

    return console.log("success: User has been deleted");
  }
  res.status(404).json({
    error: "User not found",
  });

  return console.log("error: User not found");
});

//update user
app.put("/user/:id", (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body;

  //verify id
  if (isNaN(id)) {
    res.status(400).json({
      error: "Invalid type of data"
    });
  } else {
    var resultUser = DB.users.find(user => user.id === parseInt(id));

    //verify if is undefined
    if (resultUser != undefined) {
      if (username != undefined) {
        resultUser.username = username;
        console.log(username);
      }
      if (email != undefined) {
        resultUser.email = email;
      }
      if (password != undefined) {
        resultUser.password = password;
      }

      res.status(200).json({
        success: "User has been updated"
      });
      return console.log("success: User has been updated");
    } else {
      res.status(404).json({
        error: "User not found",
      });

      return console.log("error: User not found");
    }
  }
});

//auth user
app.post("/auth", (req, res) => {
  let { username, password } = req.body;

  if (username != undefined && password != undefined) {
    let resultUser = DB.users.find(user => user.username == username);

    if (resultUser != undefined) {
      if (resultUser.password == password) {
        jwt.sign({
          id: resultUser.id,
          username: resultUser.username
        }, jwtSecret, { expiresIn: '48h' }, (error, token) => {
          if (error) {
            res.status(500).json({
              error: "Internal error, contact the support"
            });
          } else {
            res.status(200).json({
              token: token
            });

            return console.log("Token generated");
          }
        });
      } else {
        res.status(404).json({
          error: "Username/Password not found"
        });
        return console.log("error: Username/Password not found");
      }
    } else {
      res.status(404).json({
        error: "Username/Password not found"
      });
      return console.log("error: Username/Password not found");
    }
  } else {
    res.status(400).json({
      error: "Invalid username/password"
    });
    return console.log("error: Invalid username/password");
  }
});

//run serve (npm start)
app.listen(PORT, () => {
  console.log("🚀 Server running on 🚪", PORT);
});