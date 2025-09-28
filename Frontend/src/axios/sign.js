import { Api } from "./api";

export const addSignToPetition = async ({user_id,petition_id,signed_user_id}) => {
  try {
    const response = await Api.post('/sign/add' , {petition_id,signed_user_id});
    await Api.post('/petitions/updateSign' , {pet_id:petition_id,id: response.data.response._id , remove: false});
    await Api.post('/users/updateSign' , {user_id,id: response.data.response._id , remove: false});
    return {
      found: true,
      message: "SuccessFully Signed Petition"
    }
  } catch (e) {
    console.log(e);
    return {
      found: false,
      message: e.response.data.text
    }
  }
}

export const removeSignToPetition = async ({user_id,id,petition_id}) => {
  try {
    const response = await Api.delete(`/sign/remove/${id}`);
    await Api.post('/petitions/updateSign' , {pet_id:petition_id,id , remove: true});
    await Api.post('/users/updateSign' , {user_id,id , remove: true});
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