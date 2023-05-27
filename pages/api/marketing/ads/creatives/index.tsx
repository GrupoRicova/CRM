import { NextApiHandler } from 'next';
import axios from 'axios';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, caption, imageUrls, imageHashes } = req.body;

  try {
    const childAttachments = imageUrls.map((imageUrl: string, index: number) => ({
      link: imageUrl,
      image_hash: imageHashes[index],
    }));

    const response = await axios.post(
      `https://graph.facebook.com/v16.0/act_741292430975362/adcreatives`,
      {
        name: 'Carousel Ad Creative',
        object_story_spec: {
          page_id: '100537732453357',
          link_data: {
            message: caption,
            name: title,
            call_to_action: { type: 'LEARN_MORE', value: { app_destination: 'MESSENGER' } },
            child_attachments: childAttachments,
          },
        },
      },
      {
        params: {
          access_token: process.env.PeToken,
        },
      }
    );

    const creativeId = response.data.id;

    return res.status(200).json({ creativeId });
  }catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      
    });
  }
};

export default handler;
