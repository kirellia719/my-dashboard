import "./App.scss";

import router_dom from "./utils/router";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import MainLayout from "./layout/MainLayout/MainLayout";

import store from "./redux";
import { Provider } from "react-redux";
import AuthLayout from "./layout/AuthLayout";
import ProfilePage from "~/page/ProfilePage";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";

import Test from "./component/Test";
import { ToastContainer as ToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
   { path: "/test", element: <Test /> },
   {
      path: "/",
      element: <MainLayout />,
      children: [
         ...router_dom.map((r) => ({
            path: `${r.link}/*`,
            element: <r.page />,
         })),
         {
            path: "/profile",
            element: <ProfilePage />,
         },
      ],
   },
   {
      path: "/auth",
      element: <AuthLayout />,
   },
]);

const App = () => {
   return (
      <Provider store={store}>
         <ToastContainer />
         <ToastifyContainer />
         <div className="App">
            <RouterProvider router={router} />
         </div>
      </Provider>
   );
};

export default App;
