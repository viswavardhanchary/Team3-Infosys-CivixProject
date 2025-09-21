import { Api } from "./api";
import {v4 as uuidv4} from 'uuid';

export const login = async ({email , password}) => {
  try {
    let response = await Api.post('/users/login' , {email , password});
    return {
      found: true,
      message: `SucessFull Login`,
      token: response.data.token
    };
  }catch(e) {
    return {
      found: false,
      message: e.response?e.response.data.text:"Invalid Email/password"
    }
  }
} 


export const signup = async ({name , email , password , role , location}) => {
  
  const user_name = name + "_" + uuidv4().slice(0,8);
  try {
    let response = await Api.post('/users/signup' , {user_name , name,email,password , role,location});
    return {
      found: true,
      message: `SucessFull SignUp`,
      token: response.data.token
    };
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
} 


export const verify = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await Api.get("/users/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return {
      found: true,
      message: `SucessFull Login`,
    };
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
} 


export const userInfo = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await Api.get("/users/userInfo", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return {
      found: true,
      message: `SucessFull Login`,
      user: response.data
    };
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
} 





