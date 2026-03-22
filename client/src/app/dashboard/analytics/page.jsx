"use client";

import { dashboardCount } from "@/redux/Slices/dashboardSlice";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const data = useSelector((state) => state.dashboard.count);

  useEffect(() => {
    dispatch(dashboardCount());
  }, [dispatch]);

  const usersTotal = data?.users?.total || 0;
  const postsTotal = data?.posts?.total || 0;
  const reportsTotal = data?.reports?.total || 0;

  const pieData = [
    { name: t("dashboard.usersName", "Users"), value: usersTotal },
    { name: t("dashboard.postsName", "Posts"), value: postsTotal },
    { name: t("dashboard.reportsName", "Reports"), value: reportsTotal },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const chartData = [
    {
      name: t("dashboard.usersName", "Users"),
      [t("dashboard.thisWeek", "This Week")]: data?.users?.this_week,
      [t("dashboard.thisMonth", "This Month")]: data?.users?.this_month,
      [t("dashboard.thisYear", "This Year")]: data?.users?.this_year,
    },
    {
      name: t("dashboard.postsName", "Posts"),
      [t("dashboard.thisWeek", "This Week")]: data?.posts?.this_week,
      [t("dashboard.thisMonth", "This Month")]: data?.posts?.this_month,
      [t("dashboard.thisYear", "This Year")]: data?.posts?.this_year,
    },
    {
      name: t("dashboard.reportsName", "Reports"),
      [t("dashboard.thisWeek", "This Week")]: data?.reports?.this_week,
      [t("dashboard.thisMonth", "This Month")]: data?.reports?.this_month,
      [t("dashboard.thisYear", "This Year")]: data?.reports?.this_year,
    },
  ];

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">{t("dashboard.statistics", "Dashboard Statistics")}</h1>

      <Card className="bg-[var(--card-bg)] shadow p-4 transition-colors duration-300" sx={{ backgroundImage: "none" }}>
        <Typography variant="h6" gutterBottom className="text-[var(--text-primary)]">
          {t("dashboard.totalsOverview", "Totals Overview")}
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
          {t("dashboard.summaryChart", "Summary Chart")}
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
            <Bar dataKey={t("dashboard.thisWeek", "This Week")} fill="#3b82f6" />
            <Bar dataKey={t("dashboard.thisMonth", "This Month")} fill="#10b981" />
            <Bar dataKey={t("dashboard.thisYear", "This Year")} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
