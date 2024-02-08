import apiSlice from "./apiSlice";
import { OTP_URL, PLANS_URL } from "../constants";

const otpSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendOTP: builder.mutation({
			query: (data) => ({
				url: `${OTP_URL}/send`,
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
		getOTPMethod: builder.query({
			query: () => ({
				url: `${OTP_URL}/otp-method`,
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const {
	useSendOTPMutation,
	useVerifyOTPMutation,
	useGetOTPMethodQuery,
} = otpSlice;
