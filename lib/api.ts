import axios from "axios";
import { redirect } from "next/navigation";
import config from "./config";
import { toast } from "@/hooks/use-toast";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      // User not auth, ask to re login
      toast({ description: "Please login" });
      // Sends the user to the login page
      redirect(config.auth.loginUrl);
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user
    if (error.message) {
      toast({ description: error.message, variant: "destructive" });
    } else {
      toast({ description: "Something went wrong...", variant: "destructive" });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
