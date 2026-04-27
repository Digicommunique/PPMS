export interface Customer {
  id: string;
  name: string;
  companyName: string;
  gstNo: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  creditLimit: number;
  outstandingBalance: number;
  type: 'Walk-in' | 'Corporate' | 'Vendor';
}

export interface Job {
  id: string;
  orderDate: Date;
  customerId: string;
  productType: string;
  size: string;
  quantity: number;
  colorType: 'B/W' | '4 Color';
  paperType: string;
  gsm: number;
  printingType: string;
  finishing: string[];
  deliveryDate: Date;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  totalAmount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Paper' | 'Ink' | 'Plates' | 'Spare Parts' | 'Packaging';
  unit: string;
  currentStock: number;
  reorderLevel: number;
  purchasePrice: number;
  supplierId: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'Super Admin' | 'Factory Manager' | 'Sales Executive' | 'Production Manager' | 'Inventory Manager' | 'Accountant' | 'Delivery Staff';
}
