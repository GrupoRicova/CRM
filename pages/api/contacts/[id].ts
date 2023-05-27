// pages/api/contactRequests.ts

import { NextApiRequest, NextApiResponse } from 'next';
import ebAPI from 'api';

const sdk = ebAPI('@easybroker/v1.0#ji9netle4ftlzp');
sdk.auth('5x2bueulm8c45zutpl6sfbvv7csoyo');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const { data } = await sdk.getContact_requests({
      page: 1 ,
      limit: 20 ,
      property_id: id as string,
    });
    res.status(200).json(data);
  } catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      imageData: undefined,
    });
  }
}
