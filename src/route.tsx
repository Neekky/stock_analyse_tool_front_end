import {
    createBrowserRouter,
    Navigate
} from "react-router-dom";

import Home from "./pages/home/index";
import LimitUpAnalyse from "./pages/limitup-analyse";
import MultiLimitUpAnalyse from "./pages/multi-limitup-analyse";
import WinnersListAnalyse from "./pages/winners-list-analyse";
import EarlyLimitStartegyAnalyse from "./pages/early-limit-strategy-analyse";

console.log(import.meta.env, 31321)
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "limitup-analyse",
                element: <LimitUpAnalyse />,
            },
            {
                path: "multi-limitup-analyse",
                element: <MultiLimitUpAnalyse />,
            },
            {
                path: "winners-list-analyse",
                element: <WinnersListAnalyse />,
            },
            {
                path: "early-limit-analyse",
                element: <EarlyLimitStartegyAnalyse />,
            },
            
        ],
    },

    {
        path: "*",
        element: <Navigate to="/" replace />, // 重定向到主页
    }
], {
    basename: import.meta.env.VITE_APP_REACT_ROUTE_BASENAME
});
