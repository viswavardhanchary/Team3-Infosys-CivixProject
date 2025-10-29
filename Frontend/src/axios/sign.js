import { Api } from "./api";
import { userInfo } from "./user";

export const addSignToPetition = async ({ user_id, petition_id, signed_user_id }) => {
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/petitions/get')

      const petition = data.data.filter((cur) => cur._id === petition_id);

      try {
        const activity = "Added the Sign to Petition\nTitle:" + petition[0].title + "\nDescription:" + petition[0].description;
        await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : petition[0].created_user_id});
      } catch (e) {

      }
    }
    const response = await Api.post('/sign/add', { petition_id, signed_user_id });
    await Api.post('/petitions/updateSign', { pet_id: petition_id, id: response.data.response._id, remove: false });
    await Api.post('/users/updateSign', { user_id, id: response.data.response._id, remove: false });
    return {
      found: true,
      message: "SuccessFully Signed Petition"
    }
  } catch (e) {

    return {
      found: false,
      message: e.response.data.text
    }
  }
}

export const removeSignToPetition = async ({ user_id, id, petition_id }) => {
  try {
    const user = (await userInfo()).user;
    if (user.email.endsWith("@civix.gov.in")) {
      const data = await Api.get('/petitions/get')

      const petition = data.data.filter((cur) => cur._id === petition_id);

      try {
        const activity = "Removed the Sign to Petition\nTitle:" + petition[0].title + "\nDescription:" + petition[0].description;
         await Api.put('/log/addLog' , {activity , admin_id : user._id , user_id : petition[0].created_user_id});
      } catch (e) {
      }
    }
    const response = await Api.delete(`/sign/remove/${id}`);
    await Api.post('/petitions/updateSign', { pet_id: petition_id, id, remove: true });
    await Api.post('/users/updateSign', { user_id, id, remove: true });
    return {
      found: true,
      message: "SuccessFully Signed Petition"
    }
  } catch (e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
}

export const getSignsApi = async () => {
  try {
    const response = await Api.get("/sign/getSign");
    return {
      found: true,
      data: response.data.data
    }
  } catch (e) {
    return {
      found: false,
      message: e.response.data.text
    }
  }
}