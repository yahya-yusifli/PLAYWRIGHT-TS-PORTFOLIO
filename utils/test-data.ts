// Load environment variables
import dotenv from "dotenv";
dotenv.config();

export const SauceDemoUsers = {
  standard: {
    username: process.env.SAUCEDEMO_STANDARD_USER ,
    password: process.env.SAUCEDEMO_PASSWORD,
  },
  locked: {
    username: process.env.SAUCEDEMO_LOCKED_USER,
    password: process.env.SAUCEDEMO_PASSWORD ,
  },
  performance: {
    username: process.env.SAUCEDEMO_PERFORMANCE_USER,
    password: process.env.SAUCEDEMO_PASSWORD,
  },

  problem: {
    username: process.env.SAUCEDEMO_PROBLEM_USER,
    password: process.env.SAUCEDEMO_PASSWORD,
  },
};

export const TestURLs = {
  sauceDemo: process.env.BASE_URL,
};

export const APIEndpoints = {
  jsonPlaceholder: process.env.JSONPLACEHOLDER_API,
};
