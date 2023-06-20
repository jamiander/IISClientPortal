import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const BASE_URL = "https://iisclientportalfunctionapplinux.azurewebsites.net/api/"//"https://iisclientportalfunctionapp.azurewebsites.net/api/";//"https://localhost:7000/api/";

/*enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}*/

interface ErrorMessage
{
  clientFriendlyMessage: string,
  developerMessage: string
}

interface ApiResponse<T> {
  responseTime: Date,
  data: T,
  error: ErrorMessage
}

const headers: Readonly<Record<string, string | boolean>> = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": true,
    "X-Requested-With": "XMLHttpRequest",
};

const injectToken = (config: AxiosRequestConfig): InternalAxiosRequestConfig => {
  return config as InternalAxiosRequestConfig;
    /*try {
      const token = localStorage.getItem("accessToken");
  
      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      throw new Error(error);
    }*/
};

class Http {
    private instance: AxiosInstance | null = null;
  
    private get http(): AxiosInstance {
      return this.instance != null ? this.instance : this.initHttp();
    }
  
    initHttp() {
      const http = axios.create({
        baseURL: BASE_URL,
        headers,
        withCredentials: false,
      });
  
      http.interceptors.request.use(injectToken, (error) => Promise.reject(error));
  
      http.interceptors.response.use(
        (response) => response,
        (error) => {
          const { response } = error;
          return this.handleError(response);
        }
      );
  
      this.instance = http;
      return http;
    }

    request<ResponseType = any>(config: AxiosRequestConfig): Promise<ApiResponse<ResponseType>> {
        return this.http.request(config);
    }

    get<ResponseType = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<ResponseType>>> {
        return this.http.get<ApiResponse<ResponseType>>(url, config);
    }

    post<RequestType = any, ResponseType = any>(
        url: string,
        data?: RequestType,
        config?: AxiosRequestConfig
      ): Promise<AxiosResponse<ApiResponse<ResponseType>>> {
        return this.http.post<RequestType, AxiosResponse<ApiResponse<ResponseType>>>(url, data, config);
    }

    put<RequestType = any, ResponseType = any>(
        url: string,
        data?: RequestType,
        config?: AxiosRequestConfig
      ): Promise<AxiosResponse<ApiResponse<ResponseType>>> {
        return this.http.put<RequestType, AxiosResponse<ApiResponse<ResponseType>>>(url, data, config);
      }
    
      delete<RequestType = any, ResponseType = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<ResponseType>>> {
        return this.http.delete<RequestType, AxiosResponse<ApiResponse<ResponseType>>>(url, config);
      }

// Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: AxiosResponse<ApiResponse<any>>) {
    let errorMessage = error.data.error.clientFriendlyMessage;
    //ShowToast("Error", errorMessage, "error");
    /*const { status } = error;

    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }*/

    return Promise.reject(error);
  }
}

export const http = new Http();









