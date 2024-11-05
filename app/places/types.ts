// app/places/types.ts

export type BinStore = {
  request_id: string;
  name: string;
  location?: {
    formatted_address?: string;
  };
  contact?: {
    phone?: string;
  };
  website?: string;
};
