import type { NextApiRequest, NextApiResponse } from 'next';
import ebAPI from 'api';

const sdk = ebAPI('@easybroker/v1.0#ji9netle4ftlzp');
sdk.auth('5x2bueulm8c45zutpl6sfbvv7csoyo');

type Property = {
  public_id: number;
  title: string;
  location: string;
  // Add any other properties you want to include
}

type APIResponse = {
  locations: string[];
}

type APIErrorResponse = APIResponse & {
    message: string;
};

type SearchParams = {
  updated_after?: string;
  updated_before?: string;
  operation_type?: string;
  min_price?: string;
  max_price?: string;
  min_bedrooms?: string;
  min_bathrooms?: string;
  min_parking_spaces?: string;
  min_construction_size?: string;
  max_construction_size?: string;
  min_lot_size?: string;
  max_lot_size?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse | APIErrorResponse>
) {
  if (req.method === 'GET') {
    try {
      const responseapi1 = await sdk.getProperties({
        page: 1,
        limit: 50,
      });
      const properties1 = responseapi1.data.content as Property[];
      const locations1 = properties1.map(property => property.location);
      
      const responseapi2 = await sdk.getProperties({
        page: 2,
        limit: 50,
      });
      const properties2 = responseapi2.data.content as Property[];
      const locations2 = properties2.map(property => property.location);
      
      const uniqueLocations = [...new Set([...locations1, ...locations2])];
      const response: APIResponse = { locations: uniqueLocations };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', locations: [] });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed', locations: [] });
  }
}
