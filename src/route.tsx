import {
    createBrowserRouter,
} from "react-router-dom";

import HomePage from "@/pages/homepage/index";
import Home from "@/pages/old-home/index";
import LimitUpAnalyse from "@/pages/old-home/limitup-analysis";
import MultiLimitUpAnalyse from "@/pages/old-home/multi-limitup-analysis";
import WinnersListAnalyse from "@/pages/old-home/winners-list-analysis";
import EarlyLimitStartegyAnalyse from "@/pages/old-home/early-limit-strategy-analysis";
import LeadingTrendAnalysis from "@/pages/old-home/leading-trend-analysis";
import KdjLimitAnalysis from "@/pages/kdj-limit-analysis";
import MultiIndexAnalysis from "@/pages/multi-index-analysis";
import StockCombatCockpit from "@/pages/stock_combat_cockpit";
import DailyReport from "@/pages/daily-report";

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
        path: '/multi-index-analysis',
        element: <MultiIndexAnalysis />,
    },
    {
        path: '/stock-combat-cockpit',
        element: <StockCombatCockpit />,
    },
    {
        path: '/daily-report',
        element: <DailyReport />,
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
