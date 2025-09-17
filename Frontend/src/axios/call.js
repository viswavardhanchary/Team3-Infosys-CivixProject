import { userDataApi } from "./api";

export const login = async ({email , password}) => {
  try {
    let response = await userDataApi.post('/users/get' , {email , password});
    return {
      found: true,
      message: `SucessFull Login`,
      data:response.data.userdata,
      token: response.data.token
    };
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
} 


export const signup = async ({name , email , password , role , location}) => {
  const id = Math.round((Math.random()*10000000 + 1))
  try {
    let response = await userDataApi.post('/users/add' , {id , name,email,password , role,location});
    return {
      found: true,
      message: `SucessFull SignUp`,
      data:response.data
    };
  }catch(e) {
    return {
      found: false,
      message: e.response?response.data.text:"Some Error Occcured!Try Again Later!"
    }
  }
} 


export const verify = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await userDataApi.get("/users/verify", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return {
      found: true,
      message: `SucessFull SignUp`,
      data:response.data
    };
  }catch(e) {
    return {
      found: false,
      message: e.response?e.response.data.text:"Login Needed"
    }
  }
} 

