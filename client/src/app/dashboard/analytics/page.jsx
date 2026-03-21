"use client";

import { dashboardCount } from "@/redux/Slices/dashboardSlice";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.dashboard.count);

  useEffect(() => {
    dispatch(dashboardCount());
  }, [dispatch]);

  const usersTotal = data?.users?.total || 0;
  const postsTotal = data?.posts?.total || 0;
  const reportsTotal = data?.reports?.total || 0;

  const pieData = [
    { name: "Users", value: usersTotal },
    { name: "Posts", value: postsTotal },
    { name: "Reports", value: reportsTotal },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const chartData = [
    {
      name: "Users",

      "This Week": data?.users?.this_week,

      "This Month": data?.users?.this_month,

      "This Year": data?.users?.this_year,

    },

    {
      name: "Posts",

      "This Week": data?.posts?.this_week,

      "This Month": data?.posts?.this_month,

      "This Year": data?.posts?.this_year,

    },

    {
      name: "Reports",

      "This Week": data?.reports?.this_week,

      "This Month": data?.reports?.this_month,

      "This Year": data?.reports?.this_year,

    },
  ];

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Dashboard Statistics</h1>

      <Card className="bg-[var(--card-bg)] shadow p-4 transition-colors duration-300" sx={{ backgroundImage: "none" }}>
        <Typography variant="h6" gutterBottom className="text-[var(--text-primary)]">
          Totals Overview
        </Typography>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card className="bg-[var(--card-bg)] shadow p-4 mt-6 transition-colors duration-300" sx={{ backgroundImage: "none" }}>
        <Typography variant="h6" gutterBottom className="text-[var(--text-primary)]">
          Summary Chart
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="This Week" fill="#3b82f6" />

            <Bar dataKey="This Month" fill="#10b981" />

            <Bar dataKey="This Year" fill="#f59e0b" />

          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
