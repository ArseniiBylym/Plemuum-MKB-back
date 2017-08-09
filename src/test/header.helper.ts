import config from "../../config/config";

const basicAuthHeader = {"Authorization": "basic " + new Buffer(`admin:${config.adminPwd}`).toString("base64")};
const bearerAuthHeader = (token: string) => {
    return {"Authorization": `Bearer ${token}`};
};


export { basicAuthHeader, bearerAuthHeader }