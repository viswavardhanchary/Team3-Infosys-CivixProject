import axios from 'axios';

export const userDataApi = axios.create({
  baseURL: "http://localhost:5000"
});

