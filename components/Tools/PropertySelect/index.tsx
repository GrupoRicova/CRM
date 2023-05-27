import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface Property {
  public_id: number;
  title: string;
}

interface ApiResponse {
  content: Property[];
}

interface Props {
  onSelect?: (selectedOption: any) => void;
}

const Index: React.FC<Props> = ({ onSelect }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get<ApiResponse>('/api/properties');
        const { content } = response.data;
        setProperties(content);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchProperties();
  }, []);

  const options = properties.map((property) => ({
    value: property.public_id,
    label: property.title,
  }));

  return (
    <Select
      options={options}
      isLoading={isLoading}
      isDisabled={isLoading}
      placeholder="Select a property"
      onChange={onSelect}
      className='text-dark'
    />
  );
};

export default Index;
