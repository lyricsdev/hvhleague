import axios, { AxiosInstance, AxiosResponse } from "axios";
 interface errorAxios {
    message: string
    name: string
    httpCode: number
}
class AxiosService {
    private axiosInstance: AxiosInstance;
    private token: string | null = null;
    constructor(baseURL?: string) {
      this.axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
      });
    }
    async get<T>(endpoint: string): Promise<T | errorAxios>  {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint);
        return response.data;
      } catch (error : any) {
        console.log(error)
        return error as errorAxios
      }
    }
    async patch<T>(endpoint: string, data: any): Promise<T | errorAxios>  {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.patch( endpoint,
          data);
        return response.data;
      } catch (error : any) {
        return error as errorAxios
      }
    }
  
    async post<T>(endpoint: string, data: any): Promise<T | errorAxios> {
      try {
        const response: AxiosResponse<T> = await this.axiosInstance.post(
          endpoint,
          data
        );
        return response.data;
      } catch (error : any) {
        return error as errorAxios;
      }
    }
    async login<T>(data: any): Promise<T> {
      try {
        const response: AxiosResponse = await this.axiosInstance.post(
          "user/login",
          data
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }
    setUserToken(token: string | null) {
      this.token = token;
      this.axiosInstance.interceptors.request.use(
        (config) => {
          if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  
    clearUserToken() {
      this.token = null;
      this.axiosInstance.interceptors.request.use(
        (config) => {
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  }
  
const useAxios = new AxiosService("http://localhost:3001/api")
export { 
    useAxios
}