import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InventoryItem {
  id: string;
  itemType: string;
  karat: string;
  weight: number;
  price: number;
  description?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  getInventoryItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const savedInventory = localStorage.getItem('inventory');
    if (savedInventory) {
      const parsedInventory = JSON.parse(savedInventory);
      // Ensure weight and price are numbers when loading from localStorage
      return parsedInventory.map((item: any) => ({
        ...item,
        weight: parseFloat(item.weight),
        price: parseFloat(item.price),
      })).filter((item: any) => !isNaN(item.weight) && !isNaN(item.price) && item.id);
    }
    return [];
  });

  const [nextItemIdNumber, setNextItemIdNumber] = useState<number>(() => {
    const savedNextId = localStorage.getItem('nextItemIdNumber');
    return savedNextId ? parseInt(savedNextId, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('nextItemIdNumber', nextItemIdNumber.toString());
  }, [nextItemIdNumber]);

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: `ITEM-${nextItemIdNumber.toString().padStart(3, '0')}`,
      ...item,
    };
    setInventory(prev => [...prev, newItem]);
    setNextItemIdNumber(prev => prev + 1);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const getInventoryItemById = (id: string) => {
    return inventory.find(item => item.id === id);
  };

  return (
    <InventoryContext.Provider value={{ inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, getInventoryItemById }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}; 