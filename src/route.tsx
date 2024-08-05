import {
    createBrowserRouter,
} from "react-router-dom";

import HomePage from "./pages/homepage/index";
import Home from "./pages/home/index";
import LimitUpAnalyse from "./pages/limitup-analysis";
import MultiLimitUpAnalyse from "./pages/multi-limitup-analysis";
import WinnersListAnalyse from "./pages/winners-list-analysis";
import EarlyLimitStartegyAnalyse from "./pages/early-limit-strategy-analysis";
import LeadingTrendAnalysis from "./pages/leading-trend-analysis";
import KdjLimitAnalysis from "./pages/kdj-limit-analysis";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: '/kdj-limit-analysis',
        element: <KdjLimitAnalysis />,
    },
    {
        path: "/home",
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
            {
                path: "leading-trend-analyse",
                element: <LeadingTrendAnalysis />,
            }
            
        ],
    },
], {
    basename: import.meta.env.VITE_APP_REACT_ROUTE_BASENAME
});
