import { Api } from "./api";
import {v4 as uuidv4} from 'uuid';
import { userInfo } from "./user";


export const add = async ({title,description,category,location,status}) => {
  const id = uuidv4().slice(0,16);
  const user_name = (await userInfo()).user.user_name;

  try {
    const response = await Api.post('/petitions/add' , {id,created_user_name:user_name,title,description,category,location,status});
    await Api.put(`/users/update/petitions/${user_name}` , {data: id , update:true});
    return {
      found: true,
      message: response.data.text,
    }
  } catch (e) {
    return {
      found: false,
      message: e.response.data.text,
    }
  }
}


export const remove = async ({id}) => {
  try {
    const response = await Api.delete('/petitions/remove' , {id});
    await Api.put(`/users/update/petitions/${user_name}` , {data: id , update:true});
    return {
      found: true,
      message: response.data.text,
    }
  } catch (e) {
    return {
      found: false,
      message: e.response.data.text,
    }
  }
}