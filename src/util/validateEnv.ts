import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    JWT_SECRET: str(),
    S3_ACCESS_KEY: str(),
    S3_SECRET_ACCESS_KEY: str(),
    CLIENT_DOMAIN: str(),
    CLIENT_DOMAIN_S: str(),
    CLIENT_DOMAIN_NETLIFY: str(),
    CLIENT_ASSIGNED_DOMAIN: str(),
    GOOGLE_CLOUD_PROJECT: str(),
    GCLOUD_STORAGE_BUCKET: str(),
    GCLOUD_ACCESS_TOKEN: str(),
    ENVIRONMENT: str(),
});
