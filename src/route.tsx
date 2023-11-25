import React from "react";
import {
    createBrowserRouter,
} from "react-router-dom";

import App from "./App";
import LimitUpAnalyse from "./pages/limitup-analyse";
import MultiLimitUpAnalyse from "./pages/multi-limitup-analyse";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "limitup-analyse",
                element: <LimitUpAnalyse />,
                exact: true
            },
            {
                path: "multi-limitup-analyse",
                element: <MultiLimitUpAnalyse />,
                exact: true
            },
        ],
    },
]);