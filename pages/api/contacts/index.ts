import { NextApiRequest, NextApiResponse } from 'next';
import ebAPI from 'api';

const sdk = ebAPI('@easybroker/v1.0#ji9netle4ftlzp');
sdk.auth('5x2bueulm8c45zutpl6sfbvv7csoyo');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page  } = req.query;
  const limit = 20;

  try {
    const { data } = await sdk.getContact_requests({
      page,
      limit,
     
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
        .status(500)
        .json({ content: [], pagination: { limit: 0, page: 0, total: 0, next_page: null } });
  }
}
