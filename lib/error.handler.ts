import { AxiosError } from "axios";

const errorHandler = (error: unknown, fallback?: string) => {
  switch (typeof error) {
    case "string":
      return error;
    case "object":
      if (error instanceof Error) {
        if (error instanceof AxiosError) {
          if (error.response?.data?.message) {
            return error.response.data.message;
          }
        }
        return error.message;
      }
    default:
      return fallback || "An error has occurred. Please try again.";
  }
};

export default errorHandler;
