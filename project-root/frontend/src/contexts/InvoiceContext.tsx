import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Invoice {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  itemType: string;
  karat?: string;
  weight: number;
  price: number;
  manufacturingPrice?: number;
  tax?: number;
  totalPrice: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const parsedInvoices: Invoice[] = savedInvoices ? JSON.parse(savedInvoices) : [];
    return parsedInvoices.map(invoice => ({
      ...invoice,
      weight: parseFloat(invoice.weight as any) || 0,
      price: parseFloat(invoice.price as any) || 0,
      manufacturingPrice: invoice.manufacturingPrice !== undefined ? parseFloat(invoice.manufacturingPrice as any) || 0 : undefined,
      tax: invoice.tax !== undefined ? parseFloat(invoice.tax as any) || 0 : undefined,
      totalPrice: parseFloat(invoice.totalPrice as any) || 0,
    }));
  });

  const [nextSellInvoiceNumber, setNextSellInvoiceNumber] = useState<number>(() => {
    const savedNumber = localStorage.getItem('nextSellInvoiceNumber');
    return savedNumber ? parseInt(savedNumber, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
    localStorage.setItem('nextSellInvoiceNumber', nextSellInvoiceNumber.toString());
  }, [invoices]);

  const addInvoice = (invoice: Invoice) => {
    if (invoice.type === 'sell') {
      const newId = `INV-SELL-${nextSellInvoiceNumber.toString().padStart(3, '0')}`;
      const newInvoice = { ...invoice, id: newId };
      setInvoices(prev => [...prev, newInvoice]);
      setNextSellInvoiceNumber(prev => prev + 1);
    } else {
      setInvoices(prev => [...prev, { ...invoice, id: `INV-BUY-${Date.now()}` }]);
    }
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}; 