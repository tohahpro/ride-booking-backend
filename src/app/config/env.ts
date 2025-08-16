import dotenv from "dotenv";

dotenv.config();

interface EnvConfig{
    PORT: string;
    DB_URL: string;
    NODE_ENV: string;
    BCRYPT_SALT_ROUND: string;
}

const loadEnvVariables = (): EnvConfig=>{
    const requiredEnvVariables: string[] =[
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
    ];

    requiredEnvVariables.forEach((key) => {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    };
};



export const envVars = loadEnvVariables();