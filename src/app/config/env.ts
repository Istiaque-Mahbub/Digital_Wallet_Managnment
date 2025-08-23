import dotenv from "dotenv"

dotenv.config()

interface EnvConfig{
    PORT : string,
    DB_URL:string,
    Node_ENV:"development" | "production"
}

const loadEnvVariables = () =>{

    const requiredEnvVariables:string[] = ["PORT","DB_URL","NODE_ENV"]

    requiredEnvVariables.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return{
        PORT : process.env.port as string,
 DB_URL:process.env.DB_URL as string,
 Node_ENV:process.env.NODE_ENV as "development" | "production"
    }
}

export const envVars:EnvConfig = loadEnvVariables()