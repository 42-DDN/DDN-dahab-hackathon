import React, { createContext, useContext, useState, useEffect } from 'react';

interface ManufacturingFees {
  '14K': { manufacturingFee: number; wastageRate: number; };
  '18K': { manufacturingFee: number; wastageRate: number; };
  '21K': { manufacturingFee: number; wastageRate: number; };
  '24K': { manufacturingFee: number; wastageRate: number; };
}

interface TaxRates {
  vat: number;
  customs: number;
  otherTaxes: number;
}

interface FeesContextType {
  manufacturingFees: ManufacturingFees;
  taxRates: TaxRates;
  updateManufacturingFee: (karat: keyof ManufacturingFees, field: keyof ManufacturingFees['14K'], value: number) => void;
  updateTaxRate: (field: keyof TaxRates, value: number) => void;
}

const FeesContext = createContext<FeesContextType | undefined>(undefined);

export const FeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manufacturingFees, setManufacturingFees] = useState<ManufacturingFees>(() => {
    const savedFees = localStorage.getItem('manufacturingFees');
    return savedFees ? JSON.parse(savedFees) : {
      '14K': { manufacturingFee: 5, wastageRate: 2 },
      '18K': { manufacturingFee: 7, wastageRate: 2.5 },
      '21K': { manufacturingFee: 9, wastageRate: 3 },
      '24K': { manufacturingFee: 12, wastageRate: 3.5 },
    };
  });

  const [taxRates, setTaxRates] = useState<TaxRates>(() => {
    const savedTaxRates = localStorage.getItem('taxRates');
    return savedTaxRates ? JSON.parse(savedTaxRates) : {
      vat: 15,
      customs: 5,
      otherTaxes: 2,
    };
  });

  useEffect(() => {
    localStorage.setItem('manufacturingFees', JSON.stringify(manufacturingFees));
  }, [manufacturingFees]);

  useEffect(() => {
    localStorage.setItem('taxRates', JSON.stringify(taxRates));
  }, [taxRates]);

  const updateManufacturingFee = (karat: keyof ManufacturingFees, field: keyof ManufacturingFees['14K'], value: number) => {
    setManufacturingFees(prev => ({
      ...prev,
      [karat]: {
        ...prev[karat],
        [field]: value,
      },
    }));
  };

  const updateTaxRate = (field: keyof TaxRates, value: number) => {
    setTaxRates(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FeesContext.Provider value={{ manufacturingFees, taxRates, updateManufacturingFee, updateTaxRate }}>
      {children}
    </FeesContext.Provider>
  );
};

export const useFees = () => {
  const context = useContext(FeesContext);
  if (context === undefined) {
    throw new Error('useFees must be used within a FeesProvider');
  }
  return context;
}; 