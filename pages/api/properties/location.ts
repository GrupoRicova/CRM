import type { NextApiRequest, NextApiResponse } from 'next';
import ebAPI from 'api';

const sdk = ebAPI('@easybroker/v1.0#ji9netle4ftlzp');
sdk.auth('5x2bueulm8c45zutpl6sfbvv7csoyo');

type Property = {
  public_id: number;
  title: string;
  location: number;
  // Add any other properties you want to include
}

type APIResponse = {
  properties: Property[];
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

  if (req.method === 'POST') {
    const locationParam = req?.query?.location?.toString() || '';
    const searchParams: SearchParams = req.body;
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value) {
        delete searchParams[key as keyof SearchParams];
      }
    });
    const responseapi = await sdk.getProperties({
      page: 1,
      limit: 50,
      search: searchParams
    });
    const properties = responseapi.data.content as Property[];
    const filteredProperties = properties.filter(property => property.location.toString() === locationParam);
    const response: APIResponse = { properties: filteredProperties };
    res.status(200).json(response);
  } else {
    res.status(405).json({ message: 'Method not allowed',  properties: [] });

  }
  if (req.method === 'GET') {
    try {
      const locationParam = req?.query?.location?.toString() || '';
      const responseapi = await sdk.getProperties({
        page: 1,
        limit: 50,
      });
      const properties = responseapi.data.content as Property[];
      const filteredProperties = properties.filter(property => property.location.toString() === locationParam);
      const response: APIResponse = { properties: filteredProperties };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', properties: [] });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
      properties: []
    });
  }
}
