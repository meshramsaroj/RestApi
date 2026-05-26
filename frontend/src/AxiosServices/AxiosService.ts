import axios from "axios";


export const getUsers = async () => {
    const response = await axios.get("/api/users");
    console.log(response.data);
    return response.data;
}