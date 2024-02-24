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
					console.log("response", response);
					if (response.status === 200) {
						const blob = await response.blob();
						const url = URL.createObjectURL(blob); // Create a URL representing the binary data
						return url; // Return the URL instead of Uint8Array
					} else {
						throw new Error("Failed to download plan.");
					}
				},
			}),
		}),
		getClassicPlanList: builder.query({
			query: ({ isClassic }) => ({
				url: `${PLANS_URL}/history`,
				method: "GET",
				params: `isClassic=${isClassic}`,
				credentials: "include",
			}),
		}),
	}),
});

export const {
	useUploadPlanMutation,
	useDownloadPlanMutation,
	useGetClassicPlanListQuery,
} = plansApiSlice;
