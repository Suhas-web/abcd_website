import apiSlice from "./apiSlice";
import { PROMOTION_URL } from "../constants";

const promotionSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		sendPromotion: builder.mutation({
			query: (data) => ({
				url: `${PROMOTION_URL}`,
				method: "POST",
				body: data,
				credentials: "include",
			}),
		}),
	}),
});

export const { useSendPromotionMutation } = promotionSlice;
