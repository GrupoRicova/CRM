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
interface Pagination {
  limit: number;
  page: number;
  total: number;
  next_page: string | null;
}
type APIResponse = {
  content: Property[];
  pagination: Pagination;
  
}

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
  res: NextApiResponse<APIResponse>
) {
  if(req.method==='GET'){
    try {
      const limit = 20;
      const { page  } = req.query;
      const responseapi = await sdk.getProperties({
        page,
        limit,
        
      });
      console.log(responseapi)
      const content = responseapi.data.content;
      const pagination = responseapi.data.pagination

      const response: APIResponse = {
        content,
        pagination
      };
      res.status(200).json(response);
    }    catch (error) {
      console.error(error);
      res.status(500).json({ content: [], pagination: { limit: 0, page: 0, total: 0, next_page: null } });
    }
  }
  if (req.method === 'POST') {
    const searchParams: SearchParams = req.body;
    // Remove any undefined or empty search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value) {
        delete searchParams[key as keyof SearchParams];
      }
    });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
      const search = searchParams
      const responseapi = await sdk.getProperties({
        page,
        limit,
        search: search,
      });
      const properties = responseapi.data.content;
      const response: APIResponse = { content: properties, pagination: responseapi.data.pagination };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ content: [], pagination: { limit: 0, page: 0, total: 0, next_page: null } });
    }
  } else {
    res.status(405).json({ content: [], pagination: { limit: 0, page: 0, total: 0, next_page: null } });
  }
}
