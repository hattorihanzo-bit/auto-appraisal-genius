
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppraisalResult from './AppraisalResult';

interface VehicleData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
}

const AppraisalForm = () => {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: ''
  });
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: keyof VehicleData, value: string) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setVehicleData({
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: ''
    });
  };

  if (showResult) {
    return <AppraisalResult vehicleData={vehicleData} onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Auto Appraisal Genius
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  type="text"
                  value={vehicleData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  type="text"
                  value={vehicleData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="e.g., Camry"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={vehicleData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="e.g., 2020"
                  min="1900"
                  max="2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={vehicleData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="e.g., 50000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                value={vehicleData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Get Appraisal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppraisalForm;
