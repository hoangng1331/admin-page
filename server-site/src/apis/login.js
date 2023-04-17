import { axiosClient } from "../libraries/axiosClient";

export const LoginApi = async ()=>{
    try {
        const response = await axiosClient.get("/login/");
        return response
      } catch (error) {
        console.log(error);
      }
}

