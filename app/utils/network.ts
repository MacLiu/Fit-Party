import { AsyncStorage } from "react-native";

const localBaseURL = 'http://127.0.0.1:8000';
// const localBaseURL = 'http://10.0.1.22:8000';
const prodURL = 'https://evolveai.wm.r.appspot.com';

export interface HttpResponse<T> extends Response{
  parsedBody?: T,
}

export type Request = {
  url: string;
  method?: string;
  body?: Object;
  ignoreToken?: boolean;
};

export class NetworkError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "NetworkError";
    this.status = status;
  }
}

export async function makeRequest<T>(
  request: Request,
): Promise<T> {
  const token = await getCachedAccessToken();
  const url = localBaseURL + '/' + request.url;
  const headers: Headers | string[][] | {[key: string]: string} | undefined = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (!request.ignoreToken && token) {
    headers['Authorization'] = 'Token ' + token;
  }
  console.log('url', url);
  console.log('body', {
    method: request.method ? request.method : 'POST',
    body: request.body && JSON.stringify(request.body),
    headers: headers,
  });
  const response: HttpResponse<T> = await fetch(
    url,
    {
      method: request.method ? request.method : 'POST',
      body: request.body && JSON.stringify(request.body),
      headers: headers,
    },
  );
  if (!response.ok) {
    throw new NetworkError(response.status, response.statusText);
  }
  if (response.status === 204) {
    return {} as any as T;
  }
  const text = await response.text();
  if (!text.length) {
    return {} as any as T;
  }
  const body = JSON.parse(text);
  console.log('response body', body)
  return body;
}

const accessTokenKey = 'accessToken';
export const persistToken = async(token: string) => {
  try {
    await AsyncStorage.setItem(accessTokenKey, token);
  } catch(e) {
    // save error
  }
}

export const deleteToken = async() => {
  try {
    await AsyncStorage.removeItem(accessTokenKey);
  } catch(e) {
    // save error
  }
}

export const getCachedAccessToken = async() => {
    const value = await AsyncStorage.getItem(accessTokenKey);
    return value;
}