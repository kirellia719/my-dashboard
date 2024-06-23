import "./App.scss";

import router_dom from "./utils/router";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import MainLayout from "./layout/MainLayout/MainLayout";

import store from "./redux";
import { Provider } from "react-redux";
import AuthLayout from "./layout/AuthLayout";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";

const router = createBrowserRouter([
   {
      path: "/",
      element: <MainLayout />,
      children: router_dom.map((r) => ({ path: r.link, element: <r.page /> })),
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
         <div className="App">
            <RouterProvider router={router} />
         </div>
      </Provider>
   );
};

export default App;
