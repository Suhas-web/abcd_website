import apiSlice from "./apiSlice";
import { OTP_URL } from "../constants";

const otpSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOTPSMS: builder.mutation({
      query: (data) => ({
        url: `${OTP_URL}/sms`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${OTP_URL}/verify`,
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const { useSendOTPSMSMutation, useVerifyOTPMutation } = otpSlice;
