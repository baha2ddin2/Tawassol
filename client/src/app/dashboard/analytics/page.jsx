"use client";

import { Card, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  // Sample data from your response
  const data = {
    users: { total: 2, this_week: 0, this_month: 2, this_year: 2 },
    posts: { total: 2, this_week: 0, this_month: 2, this_year: 2 },
    reports: { total: 0, this_week: 0, this_month: 0, this_year: 0 },
  };

  // Convert data into arrays for charts
  const chartData = [
    {
      name: "Users",
      This_Week: data.users.this_week,
      This_Month: data.users.this_month,
      This_Year: data.users.this_year,
      Total: data.users.total,
    },
    {
      name: "Posts",
      This_Week: data.posts.this_week,
      This_Month: data.posts.this_month,
      This_Year: data.posts.this_year,
      Total: data.posts.total,
    },
    {
      name: "Reports",
      This_Week: data.reports.this_week,
      This_Month: data.reports.this_month,
      This_Year: data.reports.this_year,
      Total: data.reports.total,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard Statistics</h1>

      {/* <div className="grid md:grid-cols-3 gap-6 mb-6">
        Cards
        <Card className="bg-white shadow hover:shadow-lg transition">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Users
            </Typography>
            <Typography>Total: {data.users.total}</Typography>
            <Typography>This Week: {data.users.this_week}</Typography>
            <Typography>This Month: {data.users.this_month}</Typography>
            <Typography>This Year: {data.users.this_year}</Typography>
          </CardContent>
        </Card>

        <Card className="bg-white shadow hover:shadow-lg transition">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Posts
            </Typography>
            <Typography>Total: {data.posts.total}</Typography>
            <Typography>This Week: {data.posts.this_week}</Typography>
            <Typography>This Month: {data.posts.this_month}</Typography>
            <Typography>This Year: {data.posts.this_year}</Typography>
          </CardContent>
        </Card>

        <Card className="bg-white shadow hover:shadow-lg transition">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Reports
            </Typography>
            <Typography>Total: {data.reports.total}</Typography>
            <Typography>This Week: {data.reports.this_week}</Typography>
            <Typography>This Month: {data.reports.this_month}</Typography>
            <Typography>This Year: {data.reports.this_year}</Typography>
          </CardContent>
        </Card>
      </div> */}

      {/* Chart */}
      <Card className="bg-white shadow p-4">
        <Typography variant="h6" gutterBottom>
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
            <Bar dataKey="This_Week" fill="#3b82f6" />
            <Bar dataKey="This_Month" fill="#10b981" />
            <Bar dataKey="This_Year" fill="#f59e0b" />
            <Bar dataKey="Total" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
