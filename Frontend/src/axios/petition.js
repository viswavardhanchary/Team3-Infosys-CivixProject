import { Api } from "./api";
import { userInfo } from "./user";


export const add = async ({id ,title,description,category,location,goal,status}) => {
  const created_user_id = (await userInfo()).user._id.toString();
  try {
    const response = await Api.post('/petitions/add' , {id,created_user_id,title,description,category,location,status,goal,created_on:new Date()});
    if(id) {
      await Api.delete(`/petitions/remove/${id}`);
    }
    return {
      found: true,
      message: response.data.text,
    }
  } catch (e) {
    console.log(e);
    return {
      found: false,
      message: e.response?.data?.text,
    }
  }
}

export const getPetitionsData = async () => {
  try {
    const response = await Api.get('/petitions/get');
    return {
      found: true,
      data: response.data
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
    const response = await Api.delete(`/petitions/remove/${id}`);
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