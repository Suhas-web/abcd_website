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
    downloadPlan: builder.mutation({
      query: (id) => ({
        url: `${PLANS_URL}/retrieveFile/${id}`,
        method: "POST",
        responseHandler: async (response) => {
          const blob = await response.blob();
          console.log("blob", blob);
          const unit8 = new Response(blob)
            .arrayBuffer()
            .then((buffer) => new Uint8Array(buffer));
          console.log("unit8", await unit8);
          return await unit8;
        },
      }),
    }),
  }),
});

export const { useUploadPlanMutation, useDownloadPlanMutation } = plansApiSlice;
