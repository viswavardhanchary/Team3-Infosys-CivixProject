import { Api } from "./api";
import { userInfo } from "./user";

export const add = async ({ id, title, description, options, category, location, allowMultiple }) => {
  const created_user_id = (await userInfo()).user._id.toString();
  const newOptions = options.map((cur) => {
    return {
      text: cur,
      votes: []
    }
  })
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      try {
        const activity = "Added the Poll\nTitle:" + title + "\nDescription:" + description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : polls[0].created_user_id});
      } catch (e) {

      }
    }
    const response = await Api.post('/polls/add', { id, title, description, options: newOptions, category, location, allowMultiple, created_user_id });
    return {
      found: true,
      message: response.data.text,
    }
  } catch (e) {

    return {
      found: false,
      message: e.response?.data?.text,
    }
  }
}

export const remove = async (id) => {
  try {
    const user = (await userInfo()).user;
    if(user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/polls/getPolls')

      const polls = data.data.filter((cur)=> cur._id === id);

      try {
        const activity = "Removed the Polls\nTitle:"+polls[0].title+"\nDescription:"+polls[0].description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : polls[0].created_user_id});
      }catch(e) {

      }
    }
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

export const update = async ({ id, options }) => {
  try {
    const user = (await userInfo()).user;
    if(user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/polls/getPolls')

      const polls = data.data.filter((cur)=> cur._id === id);

      try {
        const activity = "Voted to the Polls\nTitle:"+polls[0].title+"\nDescription:"+polls[0].description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : polls[0].created_user_id});
      }catch(e) {

      }
    }
    const response = await Api.put(`/polls/update/${id}`, { options });
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

export const updateClose = async (id, isClosed) => {
  try {
    const response = await Api.put(`/polls/updateClose/${id}`, { isClosed });
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
