import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TeamData {
  name: string;
  level: number;
  points: number;
}

export default function TeamPointsChart() {
  const [data, setData] = useState<TeamData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1KkhsxZYIl8FC3zcay3JxsO7fKgA9KX33oh2u-UlKLQU/values/Sheet1!A:E?key=AIzaSyA3lUY4ETZ3hrXpRko4N5QVOBl8b_ZAnlY");
        const result = await response.json();
        
        const formattedData: { [key: string]: TeamData } = {};
        
        result.values.slice(1).forEach(([timestamp, team, level, additionalPoints, totalPoints]: string[]) => {
          if (!formattedData[team]) {
            formattedData[team] = { name: team, level: Number(level), points: 0 };
          }
          formattedData[team].points = parseInt(totalPoints, 10) || 0;
        });
        
        setData(Object.values(formattedData));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Perolehan Poin Tim</h1>
      <div className="w-full max-w-4xl h-96 bg-white shadow-lg rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" className="text-gray-700" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="points" fill="#4F46E5" barSize={50} radius={[5, 5, 0, 0]} name="Total Points" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
