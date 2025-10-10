import { Api } from "./api";
import { userInfo } from "./user";

export const add  = async({title,description,options,category,location,allowMultiple}) => {
  const created_user_id = (await userInfo()).user._id.toString();
  console.log(title,description,options,category,location,allowMultiple);
  const newOptions = options.map((cur)=> {
    return {
      text : cur,
      votes: []
    }
  })
    try {
      const response = await Api.post('/polls/add' , {title,description,options:newOptions,category,location,allowMultiple,created_user_id});
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

export const remove = async(id) => {
  try {
    const response = await Api.delete(`/polls/remove/${id}`);
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

export const update = async({id , options}) => {
  try {
    const response = await Api.put(`/polls/update/${id}` , {options});
    return {
      found: true,
      message: response.data.text
    }
  } catch (e) {
    return {
      found: false,
      message: e.response.data.text,
    }
  }
}

export const get = async () => {

}

export const getPollsData = async () => {
  try {
    const response = await Api.get('/polls/getPolls');
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
