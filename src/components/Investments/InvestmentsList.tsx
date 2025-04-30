import React from "react";
import { InvestmentFormWrapper } from "./InvestmentFormWrapper";

// Assuming you have types defined for Investment
interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  // Add other properties as needed
}

export const InvestmentsList = () => {
  // Dummy data for investments
  const investmentsData: Investment[] = [
    { id: "1", name: "Tesla", type: "Stock", amount: 5000 },
    { id: "2", name: "Bitcoin", type: "Crypto", amount: 3000 },
    { id: "3", name: "Real Estate Fund", type: "REIT", amount: 10000 },
  ];

  return (
    <div>
      <h2>Your Investments</h2>
      <ul>
        {investmentsData.map((investment) => (
          <li key={investment.id}>
            {investment.name} - {investment.type} - ${investment.amount}
          </li>
        ))}
      </ul>
      <InvestmentFormWrapper />
    </div>
  );
};
