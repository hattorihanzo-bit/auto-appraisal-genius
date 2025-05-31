
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarFront, Wrench, CheckCircle2, AlertCircle, Ban, Wallet, BarChart3 } from "lucide-react";
import AppraisalResult from "./AppraisalResult";

// Types for our form data
interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  type: string;
  transmission: string;
}

interface ConditionRatings {
  exterior: number;
  interior: number;
  history: number;
  engine: number;
  documents: number;
}

interface RepairItem {
  name: string;
  cost: number;
}

interface AppraisalResult {
  isPurchaseWorthy: boolean;
  needsRepairs: boolean;
  repairItems: RepairItem[];
  repairCost: number;
  marketPrice: number;
  recommendedBuyPrice: number;
  recommendedSellPrice: number;
  potentialProfit: number;
}

const carMakes = [
  'Toyota', 'Honda', 'Mitsubishi', 'Mazda', 'Suzuki', 'Daihatsu', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia'
];

const transmissionTypes = ['Automatic', 'Manual', 'CVT'];

// Mock function to simulate AI appraisal
const calculateAppraisal = (vehicleInfo: VehicleInfo, ratings: ConditionRatings): AppraisalResult => {
  // Calculate average rating
  const totalRating = (
    ratings.exterior + 
    ratings.interior + 
    ratings.history + 
    ratings.engine + 
    ratings.documents
  ) / 5;
  
  // Base market price calculation (this would be replaced by AI API)
  let basePrice = 0;
  
  // Simple price estimation based on make and year
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(vehicleInfo.year);
  
  if (vehicleInfo.make === 'Toyota') basePrice = 300000000;
  else if (vehicleInfo.make === 'Honda') basePrice = 280000000;
  else if (vehicleInfo.make === 'BMW' || vehicleInfo.make === 'Mercedes-Benz' || vehicleInfo.make === 'Audi') basePrice = 500000000;
  else basePrice = 250000000;
  
  // Adjust for age
  const ageDepreciation = Math.min(0.7, age * 0.08); // Max 70% depreciation
  basePrice *= (1 - ageDepreciation);
  
  // Adjust for condition
  basePrice *= (0.7 + (totalRating * 0.06)); // 70% to 100% of base price
  
  // Determine if repairs are needed
  const needsRepairs = ratings.exterior < 3 || ratings.interior < 3 || ratings.engine < 3;
  
  // Generate repair items if needed
  const repairItems: RepairItem[] = [];
  if (ratings.exterior < 3) {
    repairItems.push({ name: 'Body repair and paint', cost: 3000000 });
  }
  if (ratings.interior < 3) {
    repairItems.push({ name: 'Interior cleaning and repair', cost: 1500000 });
  }
  if (ratings.engine < 3) {
    repairItems.push({ name: 'Engine maintenance', cost: 5000000 });
  }
  
  // Calculate total repair cost
  const repairCost = repairItems.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate recommended prices
  const marketPrice = Math.round(basePrice / 1000000) * 1000000; // Round to nearest million
  const recommendedBuyPrice = Math.round((marketPrice - repairCost) * 0.9 / 1000000) * 1000000; // 90% of (market - repairs)
  const recommendedSellPrice = Math.round((marketPrice * 1.1) / 1000000) * 1000000; // 110% of market
  const potentialProfit = recommendedSellPrice - recommendedBuyPrice - repairCost;
  
  // Determine if purchase is worthy
  const isPurchaseWorthy = potentialProfit > 10000000 && ratings.documents >= 4;
  
  return {
    isPurchaseWorthy,
    needsRepairs,
    repairItems,
    repairCost,
    marketPrice,
    recommendedBuyPrice,
    recommendedSellPrice,
    potentialProfit
  };
};

const AppraisalForm: React.FC = () => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    make: '',
    model: '',
    year: '',
    type: '',
    transmission: '',
  });
  
  const [ratings, setRatings] = useState<ConditionRatings>({
    exterior: 0,
    interior: 0,
    history: 0,
    engine: 0,
    documents: 0,
  });
  
  const [showResults, setShowResults] = useState(false);
  const [appraisalResult, setAppraisalResult] = useState<AppraisalResult | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate form
  useEffect(() => {
    const { make, model, year, type, transmission } = vehicleInfo;
    const allFieldsFilled = make && model && year && type && transmission;
    const allRatingsFilled = 
      ratings.exterior > 0 && 
      ratings.interior > 0 && 
      ratings.history > 0 && 
      ratings.engine > 0 && 
      ratings.documents > 0;
    
    setIsFormValid(!!allFieldsFilled && allRatingsFilled);
  }, [vehicleInfo, ratings]);
  
  const handleVehicleInfoChange = (field: keyof VehicleInfo, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRatingChange = (category: keyof ConditionRatings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    // Calculate appraisal
    const result = calculateAppraisal(vehicleInfo, ratings);
    setAppraisalResult(result);
    setShowResults(true);
  };
  
  const handleReset = () => {
    setVehicleInfo({
      make: '',
      model: '',
      year: '',
      type: '',
      transmission: '',
    });
    
    setRatings({
      exterior: 0,
      interior: 0,
      history: 0,
      engine: 0,
      documents: 0,
    });
    
    setShowResults(false);
    setAppraisalResult(null);
  };
  
  const renderRatingGroup = (
    category: keyof ConditionRatings, 
    label: string,
    icon: React.ReactNode
  ) => {
    return (
      <div className="mb-6 appraisal-section" style={{ '--index': Object.keys(ratings).indexOf(category) } as React.CSSProperties}>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <Label className="text-base font-medium">{label}</Label>
        </div>
        <div className="rating-group">
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="rating-item">
              <input 
                type="radio"
                id={`${category}-${value}`}
                name={category}
                value={value}
                checked={ratings[category] === value}
                onChange={() => handleRatingChange(category, value)}
                className="rating-input"
              />
              <label 
                htmlFor={`${category}-${value}`}
                className="rating-label"
              >
                {value}
              </label>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground flex justify-between mt-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Auto Appraisal Genius</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Professional, AI-powered car appraisal system to evaluate vehicle condition, 
          estimate market value, and calculate potential profit margins
        </p>
      </div>
      
      {!showResults ? (
        <Card className="glassmorphism overflow-hidden">
          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 gap-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CarFront className="h-5 w-5" />
                Vehicle Information
              </h2>
              
              <div className="space-y-4 appraisal-section" style={{ '--index': 0 } as React.CSSProperties}>
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Select 
                    value={vehicleInfo.make} 
                    onValueChange={(value) => handleVehicleInfoChange('make', value)}
                  >
                    <SelectTrigger className="input-focus">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input 
                    id="model"
                    value={vehicleInfo.model}
                    onChange={(e) => handleVehicleInfoChange('model', e.target.value)}
                    className="input-focus"
                    placeholder="e.g. Camry, Civic"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year"
                    value={vehicleInfo.year}
                    onChange={(e) => handleVehicleInfoChange('year', e.target.value)}
                    className="input-focus"
                    placeholder="e.g. 2018"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input 
                    id="type"
                    value={vehicleInfo.type}
                    onChange={(e) => handleVehicleInfoChange('type', e.target.value)}
                    className="input-focus"
                    placeholder="e.g. Sedan, SUV"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select 
                    value={vehicleInfo.transmission} 
                    onValueChange={(value) => handleVehicleInfoChange('transmission', value)}
                  >
                    <SelectTrigger className="input-focus">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="border-t lg:border-t-0 lg:border-l border-border">
              <ScrollArea className="p-6 h-[500px] lg:h-auto">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Condition Rating (1-5)
                </h2>
                
                {renderRatingGroup('exterior', 'Exterior Condition', <Wrench className="h-4 w-4" />)}
                {renderRatingGroup('interior', 'Interior Condition', <Wrench className="h-4 w-4" />)}
                {renderRatingGroup('history', 'Vehicle History', <AlertCircle className="h-4 w-4" />)}
                {renderRatingGroup('engine', 'Engine & Performance', <Wrench className="h-4 w-4" />)}
                {renderRatingGroup('documents', 'Documentation & Legality', <CheckCircle2 className="h-4 w-4" />)}
              </ScrollArea>
            </div>
            
            <div className="col-span-2 p-6 border-t border-border">
              <Button 
                type="submit" 
                disabled={!isFormValid}
                className="w-full py-6 text-lg transition-all duration-300"
              >
                Generate Appraisal Report
              </Button>
              
              {!isFormValid && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Please complete all fields and ratings to continue
                </p>
              )}
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button variant="outline" onClick={handleReset} className="card-hover">
              New Appraisal
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 glassmorphism card-hover result-card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CarFront className="h-5 w-5" />
                Vehicle Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="font-medium">{vehicleInfo.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{vehicleInfo.model}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{vehicleInfo.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{vehicleInfo.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-medium">{vehicleInfo.transmission}</p>
                  </div>
                </div>
                
                <Separator />
                
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Condition Summary
                </h3>
                
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                      ${ratings.exterior >= 3 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
                      dark:${ratings.exterior >= 3 ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}
                    `}>
                      {ratings.exterior}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">Exterior</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                      ${ratings.interior >= 3 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
                      dark:${ratings.interior >= 3 ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}
                    `}>
                      {ratings.interior}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">Interior</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                      ${ratings.history >= 3 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
                      dark:${ratings.history >= 3 ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}
                    `}>
                      {ratings.history}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">History</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                      ${ratings.engine >= 3 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
                      dark:${ratings.engine >= 3 ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}
                    `}>
                      {ratings.engine}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">Engine</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto w-10 h-10 flex items-center justify-center rounded-full 
                      ${ratings.documents >= 3 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}
                      dark:${ratings.documents >= 3 ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}
                    `}>
                      {ratings.documents}
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">Docs</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {appraisalResult && (
              <AppraisalResult result={appraisalResult} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppraisalForm;
