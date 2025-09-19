export type PriceFilter = {
  x: number;
  operation: "around X" | "under X" | "above X" | "between X and Y";
  y: number | null;
};

export type GeminiResponse = {
  answer: string | null;
  priceFilter: PriceFilter | null;
  requireProductData: boolean;
  saveProductForContext: string[];
};

export type StoredProduct = {
  id: string;
  objData: Product;
  textData: string;
  embedded: number[];
};

export type Product = {
  id?: string;
  brand: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  pros: string[];
  cons: string[];
  stock: number;
  specifications: {
    [key: string]: string;
  };
};

export type ProductInContext = {
  id: string;
  text: string;
  lastMensioned: number;
};
