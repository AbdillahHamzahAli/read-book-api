import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export const MYENV = {
  JWT_SCRET: process.env.JWT_SECRET as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
};

// console.log(MYENV);
