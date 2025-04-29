
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const data = [
  { name: "Logement", value: 900, color: "#4DC0B5" },
  { name: "Alimentation", value: 350, color: "#2C5282" },
  { name: "Transport", value: 200, color: "#68D391" },
  { name: "Loisirs", value: 150, color: "#F6AD55" },
  { name: "Santé", value: 100, color: "#FC8181" },
  { name: "Divers", value: 150, color: "#CBD5E0" },
];

export function ExpensesChart() {
  const [period, setPeriod] = useState("month");

  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in [animation-delay:300ms]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Répartition des dépenses</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                label={(entry) => `${entry.name}: ${entry.value}€`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} €`} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
