import {
    createBrowserRouter,
} from "react-router-dom";

import Home from "./pages/home/index";
import LimitUpAnalyse from "./pages/limitup-analyse";
import MultiLimitUpAnalyse from "./pages/multi-limitup-analyse";
import WinnersListAnalyse from "./pages/winners-list-analyse";

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
            }
        ],
    },
], {
    basename: '/platform'
});
