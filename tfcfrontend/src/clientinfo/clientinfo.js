import {createContext} from "react";

export const LoginContext = createContext({
    accessToken: '',
    email: '',
    setAccessToken: () => {},
    setEmail: () => {}
})

export const NO_ACCESS_TOKEN = ''
export const NO_EMAIL = ''
