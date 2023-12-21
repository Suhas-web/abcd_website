import apiSlice from "./apiSlice";
import { PLANS_URL } from "../constants";

const plansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPlan: builder.mutation({
      query: (data) => ({
        url: `${PLANS_URL}/upload`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useUploadPlanMutation } = plansApiSlice;
