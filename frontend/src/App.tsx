import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { getUsers } from "./AxiosServices/AxiosService";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = getUsers();
    data
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <h1>Full stack project with React and Node.js</h1>
      <p>User: {users.length}</p>
      <Button>Show</Button>
    </>
  );
}

export default App;
