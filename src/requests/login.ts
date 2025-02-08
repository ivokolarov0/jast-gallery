import { request } from './index';

type LoginValuesType = {
  email: string,
  password: string,
  remember_me: number
}

type LoginResponseType = {
  customer: string,
  token: string,
  refresh_token: string
  code?: number,
  message?: string
}

const login = async (body: LoginValuesType): Promise<[LoginResponseType | null, any]> => request('/shop/customers/token', {
  method: "POST",
  headers: {
    'content-type': "application/json"
  },
  body: JSON.stringify(body)
})

export default login;