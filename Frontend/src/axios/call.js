import { userDataApi } from "./api";

export const verifyUser = async ({email , password}) => {
  let response = null;
  try {
    response = await userDataApi.post('/users/get' , {email , password});
    return {
      found: true,
      message: `SucessFull Login`,
      data:response.data
    };
  }catch(e) {
    return {
      found: false,
      message: response.data.text
    }
  }
} 


export const addUserData = async ({name , email , password , role , location}) => {
  let response = null;
  const id = Math.round((Math.random()*10000000 + 1))
  try {
    response = await userDataApi.post('/users/add' , {id , name,email,password , role,location});
    return {
      found: true,
      message: `SucessFull SignUp`,
      data:response.data
    };
  }catch(e) {
    return {
      found: false,
      message: response?response.data.text:" "
    }
  }
} 

