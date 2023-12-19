import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store";
import PrivateRoute from "./components/PrivateRoute";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App";
import HomePage from "./screens/HomePage";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import AdminRoute from "./components/AdminRoute";
import UserEditScreen from "./screens/admin/UserEditScreen";
import MembershipScreen from "./screens/MembershipScreen";
import TrainingPlanScreen from "./screens/TrainingPlanScreen";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />}></Route>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="" element={<PrivateRoute />}>
        <Route path="/users/profile" element={<UserProfileScreen />}></Route>
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin/userList" element={<UserListScreen />}></Route>
          <Route
            path="/admin/user/:id/edit"
            element={<UserEditScreen />}
          ></Route>
        </Route>
        <Route
          path="/users/membershipPlan"
          element={<MembershipScreen />}
        ></Route>
        <Route
          path="/users/trainingPlan"
          element={<TrainingPlanScreen />}
        ></Route>
      </Route>
    </Route>
  )
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
