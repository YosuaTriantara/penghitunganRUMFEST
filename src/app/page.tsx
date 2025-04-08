"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TeamData {
  name: string;
  Tingkat: string;
  points: number;
}

export default function TeamPointsChart() {
  const [dataSD, setDataSD] = useState<TeamData[]>([]);
  const [dataSMP, setDataSMP] = useState<TeamData[]>([]);
  const [dataSMA, setDataSMA] = useState<TeamData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1KkhsxZYIl8FC3zcay3JxsO7fKgA9KX33oh2u-UlKLQU/values/Sheet1!A:E?key=AIzaSyA3lUY4ETZ3hrXpRko4N5QVOBl8b_ZAnlY");
        const result = await response.json();

        const dataSD = new Map<string, TeamData>();
        const dataSMP = new Map<string, TeamData>();
        const dataSMA = new Map<string, TeamData>();

        result.values.slice(1).forEach(([timestamp, team, Tingkat, additionalPoints, totalPoints]: string[]) => {
          const formattedData: TeamData = { name: team, Tingkat, points: parseInt(totalPoints, 10) || 0 };

          if (Tingkat === "SD") {
            dataSD.set(team, formattedData);
          } else if (Tingkat === "SMP") {
            dataSMP.set(team, formattedData);
          } else if (Tingkat === "SMA") {
            dataSMA.set(team, formattedData);
          }
        });

        setDataSD(Array.from(dataSD.values()));
        setDataSMP(Array.from(dataSMP.values()));
        setDataSMA(Array.from(dataSMA.values()));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Perolehan Nilai Supporter LKBB Bramasta 2.0</h1>

      {[
        { title: "SD", data: dataSD },
        { title: "SMP", data: dataSMP },
        { title: "SMA", data: dataSMA },
      ].map(({ title, data }) => (
        <div key={title} className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Tingkat {title}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" className="text-gray-700" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="points" fill="#4F46E5" barSize={50} radius={[5, 5, 0, 0]} name="Total Points" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
