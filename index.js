const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

var DB = {
  users: [{
    id: 23,
    firstName: "Carlos",
    lastName: "Lima",
  },
  {
    id: 51,
    firstName: "Eduardo",
    lastName: "Lima",
  },
  {
    id: 33,
    firstName: "Eduardo",
    lastName: "Rocha",
  }],
}

//return all sers
app.get("/users", (req, res) => {
  if (DB.users.length <= 0) {
    res.status(200).json({
      success: "There is no users yet"
    });


    return console.log("success: There is no users yet");
  }
  res.status(200).json(DB.users);
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
  const { id, firstName, lastName } = req.body;

  //verify id
  if (id != undefined && isNaN(id)) {
    res.status(400).json({
      error: "Invalid ID"
    });

    return console.log("error: Invalid ID")
  }

  //verify first name
  if (firstName == undefined || firstName == "") {
    res.status(400).json({
      error: "First name cannot be null"
    });

    return console.log("error: First name cannot be null");
  }

  //verify last name
  if (lastName == undefined || lastName == "") {
    res.status(400).json({
      error: "Last name cannot be null"
    });

    return console.log("error: Last name cannot be null");
  }

  DB.users.push({
    id,
    firstName,
    lastName,
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
  const { firstName, lastName } = req.body;

  //verify id
  if (isNaN(id)) {
    res.status(400).json({
      error: "Invalid type of data"
    });
  } else {
    var resultUser = DB.users.find(user => user.id === parseInt(id));

    //verify if is undefined
    if (resultUser != undefined) {
      if (firstName != undefined) {
        resultUser.firstName = firstName;
        console.log(firstName);
      }
      if (lastName != undefined) {
        resultUser.lastName = lastName;
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

//run serve (npm start)
app.listen(PORT, () => {
  console.log("🚀 Server running on 🚪", PORT);
});