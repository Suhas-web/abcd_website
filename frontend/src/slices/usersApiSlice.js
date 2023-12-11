import apiSlice from "./apiSlice";
import { USERS_URL } from "../constants";

const usersSliceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUserProfiles: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["USERS"],
      keepUnusedDataFor: 5,
    }),
    getUserProfilesDetail: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["USERS"],
    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USERS"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateProfileMutation,
  useGetUserProfilesQuery,
  useGetUserProfilesDetailQuery,
  useDeleteProfileMutation,
  useUpdateUserProfileMutation,
} = usersSliceApi;
