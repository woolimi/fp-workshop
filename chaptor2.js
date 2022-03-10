// Let's try FP library

// #################################################################
// ### Concurrency

import { pipe, map, toArray, delay, toAsync, peek, concurrent } from "@fxts/core";

const log = console.log;
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const EmailAPI = {
  async check(email) {
    const isValid = !!email.match(EMAIL_REGEX);
    await delay(500);
    return isValid ? { email, format_valid: true } : { email, format_valid: false };
  },
};

// #################################################################
// ### Frontend Case Study
const emails = [
  "Tee@gmail.com",
  "Tom@gmail.com",
  "Tommy@gmail.com",
  "Mas@gmail.com",
  "this.is.not.valid.email.com", // Invalid email
  "Moz@gmail.com",
  "Thom@gmail.com",
  "Tomzy@gmail.com",
  "Tizzy@gmail.com",
  "T-mas@gmail.com",
  "Mars@gmail.com",
];

pipe(emails, toAsync, map(EmailAPI.check), concurrent(3), peek(log), toArray);

// #################################################################
// ### Onboarding Prefill Button Logic

// https://gitlab.com/getluko/front/onboarding/-/blob/master/src/components/Navbar/components/usePrefill.js
