import axios from 'axios';

const PAGE_ACCESS_TOKEN = process.env.PaToken; // Replace with your actual page access token

export default async function handler(req: { query: { slug: any; }; method: string; body: { message: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { conversations?: any; messages?: any; success?: boolean; message?: string; error?: string; imageData:any; }): void; new(): any; }; }; }) {
  const { slug } = req.query;
  const [action, conversationId, profileid] = slug;
  try {
    if (action === 'conversations') {
      // Fetch conversations
      const response = await axios.get(`https://graph.facebook.com/v16.0/me/conversations`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'id,participants{id,name}',
        },
      });
     
      const { data } = response;
      console.log('Conversations:', data);
      res.status(200).json({
        conversations: data.data,
        imageData: undefined
        
      });
    } else if (action === 'messages') {

      if (req.method === 'GET') {
        console.log(conversationId)
        // Fetch messages
        const response = await axios.get(`https://graph.facebook.com/v16.0/${conversationId}/messages`, {
          params: {
            access_token: PAGE_ACCESS_TOKEN,
            fields: 'message,from',
            order: 'reverse_chronological'
          },
        });
        const { data } = response;
        console.log('Messages:', data.data);
        res.status(200).json({
          messages: data.data,
          imageData: undefined
        });
      } else if (req.method === 'POST') {
        // Send message
        const { message } = req.body;
        await axios.post(`https://graph.facebook.com/v16.0/${conversationId}/messages`, {
          message: { text: message },
          access_token: PAGE_ACCESS_TOKEN,
        });
        console.log('Message sent successfully!');
        res.status(200).json({
          success: true,
          imageData: undefined
        });
      }
    }else if (action === 'picture') {
      if (req.method === 'GET') {
        console.log(profileid);
        // Fetch image
        const response = await axios.get(`https://graph.facebook.com/v16.0/${profileid}/picture`, {
          params: {
            access_token: PAGE_ACCESS_TOKEN,
          },
          responseType: 'arraybuffer', // Set response type to arraybuffer
        });
    
        const imageData = Buffer.from(response.data, 'binary').toString('base64');
        // Convert the image data to base64 string
    
        res.status(200).json({ imageData });
      }
    }
    
    else {
      res.status(404).json({
        message: 'Invalid endpoint',
        imageData: undefined
      });
    }
     
  } catch (error: unknown) {
    console.error('API request failed:', (error as Error).message);
    res.status(500).json({
      error: (error as Error).message,
      imageData: undefined,
    });
  }
}
