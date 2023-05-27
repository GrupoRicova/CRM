import axios, { AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const PAGE_ACCESS_TOKEN = process.env.PeToken; // Replace with your actual page access token

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    if (req.method === 'POST') {
      const { time_range, fields } = req.body as { time_range: string; fields: string };

      // Fetch ads account insights
      const response: AxiosResponse = await axios.get(`https://graph.facebook.com/v16.0/${id}/insights`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          time_range: time_range,
          fields: fields,
        },
      });

      const { data } = response;
      console.log('Insights:', data);
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: 'Invalid method for insights endpoint',
        imageData: undefined,
      });
    }

    // Existing code for other actions...
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({
      error: 'Messenger API request failed',
      imageData: undefined,
    });
  }
}
