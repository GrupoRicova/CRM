import React, { useState, useEffect } from 'react';
import Select  from 'react-select';
import axios from 'axios';
import {Text} from  '@chakra-ui/react'

interface Contact {
  happened_at: string | undefined | any;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
}

interface ApiResponse {
 content: Contact[];
 
}

interface Props {
  onSelect?: (selectedOption: any) => void;
 
}

const Index: React.FC<Props> = ({ onSelect }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get<ApiResponse>('/api/contacts?page=1');
        console.log(response)
        const {content} = response.data;
       setContacts(content);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchContacts();
  }, []);

const options = contacts.map((contact) => ({
    value: contact.email,
    label: contact.name,
  }));
console.log(options)
  return (
    <>
  
    <Select
    options={options}
    isLoading={isLoading}
    isDisabled={isLoading}
    placeholder="Select a contact"
    onChange={onSelect}
    className='text-dark'
  />
 
    
    </>
   
  );
};

export default Index;
