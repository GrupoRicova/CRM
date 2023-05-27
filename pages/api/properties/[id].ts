// pages/api/properties/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import ebAPI from 'api';

const sdk = ebAPI('@easybroker/v1.0#ji9netle4ftlzp');
sdk.auth('5x2bueulm8c45zutpl6sfbvv7csoyo');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const propertyId = req.query.id as string;


  try {
    const { data } = await sdk.getPropertiesProperty_id({ property_id: propertyId });
    console.log(data)
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ content: [], pagination: { limit: 0, page: 0, total: 0, next_page: null } });
  }
}
