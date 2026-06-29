import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

interface DashboardSummary {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  weeklyTasks: {
    day: string;
    count: number;
  }[];
}

const COLORS = [
  "#7C5CFC",
  "#3B82F6",
  "#22C55E"
];

const DashboardCharts = () => {

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  useEffect(() => {

    api
      .get("/dashboard/summary")
      .then((res) => setSummary(res.data));

  }, []);

  if (!summary) return null;

  const pieData = [
    {
      name: "Todo",
      value: summary.todoTasks
    },
    {
      name: "In Progress",
      value: summary.inProgressTasks
    },
    {
      name: "Done",
      value: summary.doneTasks
    }
  ];

  return (
    <>

      <div className="charts-grid">

        <div className="chart-card">

          <h3>Weekly Activity</h3>

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <LineChart data={summary.weeklyTasks}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#7C5CFC"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h3>Task Status</h3>

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
              >

                {pieData.map((_, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </>
  );
};

export default DashboardCharts;