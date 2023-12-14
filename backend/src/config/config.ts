import * as dotenv from 'dotenv'
dotenv.config();

export interface iConfig {
    PORT: number
    BASEURL: string
    WEBSOCKETSPORT: number
    JWTTOKEN: string
}
const defaultConfig: iConfig = {
    PORT: 3005,
    BASEURL: "http://localhost:3000",
    WEBSOCKETSPORT: 3001,
    JWTTOKEN: "YOURSECRETKEY"
}
const getConfig = (): iConfig => {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultConfig.PORT;
    const BASEURL = process.env.BASEURL ? process.env.BASEURL : defaultConfig.BASEURL;
    const WEBSOCKETSPORT = process.env.WEBSOCKETSPORT ? parseInt(process.env.WEBSOCKETSPORT, 10) : defaultConfig.WEBSOCKETSPORT;
    const JWTTOKEN = process.env.JWTTOKEN ? process.env.JWTTOKEN : defaultConfig.JWTTOKEN;

    const config: iConfig = {
        PORT: port,
        BASEURL: BASEURL,
        WEBSOCKETSPORT: WEBSOCKETSPORT,
        JWTTOKEN:JWTTOKEN
    };

    return config;
}
export {
    getConfig
}
