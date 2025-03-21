
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Ban, CheckCircle2, DollarSign, Wallet, Wrench, BarChart3 } from "lucide-react";

// Types
interface RepairItem {
  name: string;
  cost: number;
}

interface AppraisalResultProps {
  result: {
    isPurchaseWorthy: boolean;
    needsRepairs: boolean;
    repairItems: RepairItem[];
    repairCost: number;
    marketPrice: number;
    recommendedBuyPrice: number;
    recommendedSellPrice: number;
    potentialProfit: number;
  };
}

// Format currency helper
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AppraisalResult: React.FC<AppraisalResultProps> = ({ result }) => {
  const [buyPrice, setBuyPrice] = useState(result.recommendedBuyPrice);
  const [sellPrice, setSellPrice] = useState(result.recommendedSellPrice);
  const [repairCost, setRepairCost] = useState(result.repairCost);
  
  // Calculate profit in real-time as the user edits values
  const calculateProfit = (): number => {
    return sellPrice - buyPrice - repairCost;
  };
  
  const handleBuyPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
    setBuyPrice(isNaN(value) ? 0 : value);
  };
  
  const handleSellPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
    setSellPrice(isNaN(value) ? 0 : value);
  };
  
  const handleRepairCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
    setRepairCost(isNaN(value) ? 0 : value);
  };
  
  // Calculate profit
  const profit = calculateProfit();
  const profitPercentage = (profit / buyPrice) * 100;
  
  // Determine profit status
  const isProfitGood = profit > 10000000; // 10 million IDR threshold
  const isProfitModerate = profit > 0 && profit <= 10000000;
  const isProfitNegative = profit <= 0;
  
  return (
    <Card className="glassmorphism p-6 card-hover result-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Appraisal Result
        </h2>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1
          ${result.isPurchaseWorthy ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}
        `}>
          {result.isPurchaseWorthy ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Recommended</span>
            </>
          ) : (
            <>
              <Ban className="h-4 w-4" />
              <span>Not Recommended</span>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Market Price</p>
            <p className="font-medium text-lg">{formatCurrency(result.marketPrice)}</p>
          </div>
          
          {result.needsRepairs && (
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5" />
                Repairs Needed
              </p>
              <p className="font-medium text-lg">{formatCurrency(repairCost)}</p>
            </div>
          )}
        </div>
        
        {result.needsRepairs && (
          <div className="bg-muted/50 rounded-md p-3 text-sm space-y-2">
            <p className="font-medium">Repair Items:</p>
            {result.repairItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div>
        )}
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buy-price" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Recommended Buy Price
            </Label>
            <Input
              id="buy-price"
              value={formatCurrency(buyPrice)}
              onChange={handleBuyPriceChange}
              className="input-focus text-right font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sell-price" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Recommended Sell Price
            </Label>
            <Input
              id="sell-price"
              value={formatCurrency(sellPrice)}
              onChange={handleSellPriceChange}
              className="input-focus text-right font-medium"
            />
          </div>
          
          {result.needsRepairs && (
            <div className="space-y-2">
              <Label htmlFor="repair-cost" className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                Repair Cost
              </Label>
              <Input
                id="repair-cost"
                value={formatCurrency(repairCost)}
                onChange={handleRepairCostChange}
                className="input-focus text-right font-medium"
              />
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="rounded-md p-4 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Potential Profit
            </h3>
            <p className={`font-bold text-xl
              ${isProfitGood ? 'text-green-600 dark:text-green-400' : ''}
              ${isProfitModerate ? 'text-amber-600 dark:text-amber-400' : ''}
              ${isProfitNegative ? 'text-red-600 dark:text-red-400' : ''}
            `}>
              {formatCurrency(profit)}
            </p>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className={`font-medium
              ${isProfitGood ? 'text-green-600 dark:text-green-400' : ''}
              ${isProfitModerate ? 'text-amber-600 dark:text-amber-400' : ''}
              ${isProfitNegative ? 'text-red-600 dark:text-red-400' : ''}
            `}>
              {profitPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppraisalResult;
