import * as dotenv from "dotenv";

dotenv.config();

const Token = process.env.TOKEN || "";
const OwnerId = process.env.TOKEN || "";

export default {
  Token,
  OwnerId,
};