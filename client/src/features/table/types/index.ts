export interface Row {
  id: number;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  status: "Active" | "Pending" | "Blocked" | "Archived";
  priority: "High" | "Medium" | "Low";
  category: string;
  estimated_value: string;
  budget: string;
  expenses: string;
  rating: number;
  notes: string;
  description: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateRowPayload {
  id: number;
  colId: keyof Row;
  value: unknown;
}
