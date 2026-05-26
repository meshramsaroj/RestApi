import express from "express";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const users = JSON.parse(fs.readFileSync("./MOCK_DATA.json", "utf-8"));

const app = express(); // this will create an instance of express and store it in the app variable. We can use this variable to set up our routes and start the server.
const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

//Middleware :  plugins that can be used to modify the request and response objects. They can be used to add functionality to our application, such as parsing the request body, handling CORS, etc.
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // to parse JSON request bodies
app.use(express.static("dist")); // to serve static files from the public directory

// Rest api endpoints
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/ten-users", (req, res) => {
  res.send({users: users.slice(0,10)});

})

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const foundUser = users.find((user) => user.id === parseInt(id));
  if (foundUser) {
    return res.json(foundUser);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// create new user
app
  .route("/api/users")
  .post((req, res) => {
    const body = req.body;

    const newUser = { ...body, id: users.length + 1 };

    const email = body.email;

    const foundUserByEmail = users.find((user) => user.email === email);

    if (foundUserByEmail) {
      return res.status(400).json({
        message: "User with this email already exists",
        email,
      });
    }

    users.push(newUser);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

    return res.json({ message: "User created successfully", user: newUser });
  })
  .delete((req, res) => {
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { ids } = body;
    console.log(body, ids);

    JSON.parse(ids)?.forEach((id) => {
      const foundUser = users.find((user) => user.id === parseInt(id));
      if (foundUser) {
        const foundUserIndex = users.findIndex(
          (user) => user.id === parseInt(id),
        );
        users.splice(foundUserIndex, 1);
      } else {
        res.status(404).json({ message: `User with id ${id} not found` });
      }
    });

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.json({
        message: "Users deleted successfully",
        deletedIds: ids,
      });
    });
  });

// update user , Delete user
app
  .route("/api/users/:id")
  .patch((req, res) => {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
      return res.status(400).json({ message: "Bad request" });
    }

    const foundUser = users.find((user) => user.id === parseInt(id));

    if (foundUser) {
      const updatedUser = {
        ...foundUser,
        ...body,
      };

      console.log(updatedUser);

      const index = users.findIndex((user) => user.id === parseInt(id));
      users[index] = updatedUser;

      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        if (err) {
          console.error("Error writing to file", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        return res.json({
          message: "User updated successfully",
          user: updatedUser,
        });
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  })
  .delete((req, res) => {
    // Delete user
    const { id } = req.params;
    const foundUser = users.find((user) => user.id === parseInt(id));
    if (foundUser) {
      const foundUserIndex = users.findIndex(
        (user) => user.id === parseInt(id),
      );
      users.splice(foundUserIndex, 1);
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
          console.error("Error writing to file", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res.json({ message: "User deleted successfully" });
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });



app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
