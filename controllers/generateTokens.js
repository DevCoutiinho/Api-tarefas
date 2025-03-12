import jwt from "jsonwebtoken";

const SECRET_ACESS_TOKEN = process.env.SECRET_ACESS_TOKEN;
const SECRET_REFRESH_TOKEN = process.env.SECRET_REFRESH_TOKEN;

export const generate_acess_token = (user) => {
  const acess_token = jwt.sign({ id: user.id }, SECRET_ACESS_TOKEN, {
    expiresIn: "2m",
  });
  return acess_token;
};

export const generate_refresh_token = (user) => {
  const refresh_token = jwt.sign({ id: user.id }, SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  return refresh_token;
};
