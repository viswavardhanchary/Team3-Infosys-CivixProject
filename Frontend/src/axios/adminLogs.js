// axios/adminLogs.js
import { Api } from "./api";

export const getLogs = async (admin_id) => {
  try {
    const response = await Api.get(`/log/getLog/${admin_id}`);
    return {
      found: true,
      data: response.data.data,
    };
  } catch (e) {
    console.log(e);
    return {
      found: false,
      message: e.response?.data?.text,
    };
  }
};
