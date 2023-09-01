import { config } from "dotenv";
config()

const DEFAULT_CONFIG = {
    port:3000,
    corsOrigin:"*"
}

export const appConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_CONFIG.port,
    corsOrigin: process.env.CORS_ORIGIN || DEFAULT_CONFIG.corsOrigin
}