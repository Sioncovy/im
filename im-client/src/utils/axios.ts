import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios"
import { readLocalItem } from "./storage"
import { message } from "../components/message/message"

type Result<T> = {
  code: number
  msg: string
  data?: T
}

export class Request {
  // axios 实例
  instance: AxiosInstance
  baseConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:4000",
    timeout: 3000,
  }

  constructor(config: AxiosRequestConfig) {
    // 创建 axios 实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    // 设置拦截器
    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (res: AxiosRequestConfig) => {
        const noAuthApiList = [
          "/user/login",
          "/user/register",
          "/user/authCode",
          "/email/sendCode",
        ]
        const token = readLocalItem("token")
        const url = res.url?.split("?")[0]
        console.log("url", url)
        if (res.headers) res.headers.Authorization = `Bearer ${token}`
        if (token || noAuthApiList.includes(url as string)) {
          return res
        }
        message.error("登录失效，请重新登录")
        window.location.assign("/login")
      },
      (err: any) => err
    )

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data
      },
      (err: any) => err
    )
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.delete(url, config)
  }
}

export default new Request({})
