import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Stack, Input, Button, Tag, TagLabel, TagCloseButton, Text, Heading, Center } from '@chakra-ui/react';
interface Option {
  value: string | null;
  name: string | null;
}
interface BehaviorProps {
  onChange: (selectedOptions: Option[]) => void;
}
const Behavior: React.FC<BehaviorProps> = ({ onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<Option[]>([]);
  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.get(`/api/marketing/audience/search/behavior`, {
        params: {
          search: searchTerm
        }
      });
      setOptions(res.data);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  const handleSelectTerm = (selectedOption: Option|any) => {
    setSelectedTerms([...selectedTerms, selectedOption]);
    
    onChange([...selectedTerms, selectedOption]);
  };

  const handleRemoveTerm = (removedIndex: number) => {
    const removedOption = selectedTerms[removedIndex];
    setSelectedTerms((prevSelectedTerms) =>
      prevSelectedTerms.filter((_, index) => index !== removedIndex)
    );
    setOptions((prevOptions) => [...prevOptions, removedOption]);
    onChange(selectedTerms.filter((_, index) => index !== removedIndex));
  };
  return (
    <Stack spacing={4} w={400}>
      <Center>
        <Heading>Behavior</Heading>
      </Center>
      <Select
        options={options}
        isClearable
        className="text-dark"
        isSearchable
        value={null}
     
        onChange={handleSelectTerm}
        getOptionLabel={(option:any) => option.name}
        getOptionValue={(option:any) => option.value}
        placeholder="Select terms"
      />
      <Stack direction="column" spacing={2}>
        {selectedTerms.map((term, index) => (
          <Tag key={index} size="md" variant="solid" colorScheme="teal">
            <TagLabel>{term.name}</TagLabel>
            <TagCloseButton onClick={() => handleRemoveTerm(index)} />
          </Tag>
        ))}
      </Stack>
    </Stack>
  );
};

export default Behavior;
