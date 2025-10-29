import axios from 'axios';

export const Api = axios.create({
  baseURL: "https://civix-team3-backend.onrender.com"
});

