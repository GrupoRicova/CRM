import React from 'react'
import MessageViewer from '../components/MessageViewer'
import Layout from '@/components/Layout'
export default function messages() {
    const pageId = 'YOUR_PAGE_ID';
    const accessToken = 'YOUR_ACCESS_TOKEN';
  
    return (
      <Layout>
        
        <MessageViewer />
      </Layout>
    );
}
