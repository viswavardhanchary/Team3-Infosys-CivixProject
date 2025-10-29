import { Api } from "./api";
import { userInfo } from "./user";



export const getPost = async (id) => {
  try {
    const response = await Api.get(`/comment/get/${id}`);
    return {
      found: true,
      message: response.data.data,
    }
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text,
    }
  }
}

export const addPost = async(petition_id , comment) => {
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/petitions/get')

      const petition = data.data.filter((cur) => cur._id === petition_id);

      try {
        const activity = "Added the Comment to Petition\nTitle:" + petition[0].title + "\nDescription:" + petition[0].description;

        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : petition[0].created_user_id});
      } catch (e) {
      }
    }
    const response = await Api.post('/comment/add' , {petition_id , comment});
    return {
      found: true,
      message: response.data.text,
    }
  }catch(e) {
    return {
      found: false,
      message: e.response.data.text,
    }
  }
}

export const updatePost = async (petition_id, oldComment, newComment) => {
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/petitions/get')

      const petition = data.data.filter((cur) => cur._id === petition_id);

      try {
        const activity = "Updated the Comment to Petition\nTitle:" + petition[0].title + "\nDescription:" + petition[0].description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : petition[0].created_user_id});
      } catch (e) {
      }
    }
    const response = await Api.put('/comment/update', {
      petition_id,
      oldComment,
      newComment
    });
    return {
      found: true,
      message: response.data.text,
    };
  } catch (e) {
    return {
      found: false,
      message: e.response?.data?.text || "Failed to update comment",
    };
  }
};

export const deletePost = async (petition_id, comment) => {
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/petitions/get')

      const petition = data.data.filter((cur) => cur._id === petition_id);

      try {
        const activity = "Deleted the Comment to Petition\nTitle:" + petition[0].title + "\nDescription:" + petition[0].description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : petition[0].created_user_id});
      } catch (e) {
      }
    }
    const response = await Api.delete('/comment/delete', {
      data: { petition_id, comment },
    });
    return {
      found: true,
      message: response.data.text,
    };
  } catch (e) {
    return {
      found: false,
      message: e.response?.data?.text || "Failed to delete comment",
    };
  }
};