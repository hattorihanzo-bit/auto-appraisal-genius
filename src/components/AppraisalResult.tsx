
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
}

interface AppraisalResultProps {
  vehicleData: VehicleData;
  onReset: () => void;
}

const AppraisalResult = ({ vehicleData, onReset }: AppraisalResultProps) => {
  const [repairCost, setRepairCost] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);

  // Simple appraisal calculation based on year, mileage, and condition
  const calculateBaseValue = () => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(vehicleData.year);
    const mileage = parseInt(vehicleData.mileage);
    
    // Base value starts at $25,000 and decreases with age and mileage
    let baseValue = 25000;
    baseValue -= age * 1000; // $1000 per year
    baseValue -= (mileage / 1000) * 50; // $50 per 1000 miles
    
    // Condition multiplier
    const conditionMultipliers = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6
    };
    
    baseValue *= conditionMultipliers[vehicleData.condition as keyof typeof conditionMultipliers] || 1.0;
    
    return Math.max(baseValue, 1000); // Minimum value of $1000
  };

  const baseValue = calculateBaseValue();
  const buyPrice = Math.round(baseValue * 0.8); // 80% of base value
  const sellPrice = Math.round(baseValue * 1.1); // 110% of base value
  const potentialProfit = sellPrice - buyPrice - repairCost - otherCost;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Appraisal Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="space-y-2">
                <p><strong>Make:</strong> {vehicleData.make}</p>
                <p><strong>Model:</strong> {vehicleData.model}</p>
                <p><strong>Year:</strong> {vehicleData.year}</p>
                <p><strong>Mileage:</strong> {parseInt(vehicleData.mileage).toLocaleString()} miles</p>
                <p><strong>Condition:</strong> {vehicleData.condition}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cost Components</h3>
              
              <div className="space-y-2">
                <Label htmlFor="buyPrice">Buy Price</Label>
                <Input
                  id="buyPrice"
                  type="text"
                  value={`$${buyPrice.toLocaleString()}`}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairCost">Repair Cost</Label>
                <Input
                  id="repairCost"
                  type="number"
                  value={repairCost}
                  onChange={(e) => setRepairCost(Number(e.target.value) || 0)}
                  placeholder="Enter repair cost"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherCost">Other Cost</Label>
                <Input
                  id="otherCost"
                  type="number"
                  value={otherCost}
                  onChange={(e) => setOtherCost(Number(e.target.value) || 0)}
                  placeholder="Enter other costs"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellPrice">Recommended Sell Price</Label>
                <Input
                  id="sellPrice"
                  type="text"
                  value={`$${sellPrice.toLocaleString()}`}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Potential Profit</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${potentialProfit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Sell Price - Buy Price - Repair Cost - Other Cost
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={onReset} variant="outline">
              New Appraisal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppraisalResult;
