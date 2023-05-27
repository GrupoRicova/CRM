import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Stack, Input, Button, Tag, TagLabel, TagCloseButton, Center, Heading } from '@chakra-ui/react';

interface Option {
  value: string;
  name: string;
}

interface InterestsProps {
  onChange: (selectedOptions: Option[]) => void;
}

const Interests: React.FC<InterestsProps> = ({ onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<Option[]>([]);

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.get(`/api/marketing/audience/search/interests`, {
        params: {
          search: searchTerm
        }
      });
      setOptions(res.data);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  const handleSelectTerm = (selectedOption: Option) => {
    setSelectedTerms([...selectedTerms, selectedOption]);
   
    onChange([...selectedTerms, selectedOption]);
  };

  const handleRemoveTerm = (removedIndex: number) => {
    const removedOption = selectedTerms[removedIndex];
    setSelectedTerms((prevSelectedTerms) =>
      prevSelectedTerms.filter((_, index) => index !== removedIndex)
    );
  
    onChange(selectedTerms.filter((_, index) => index !== removedIndex));
  };

  return (
    <Stack spacing={4}>
      <Center>
        <Heading>Interests</Heading>
      </Center>
      <Stack direction="row" spacing={2}>
        <Input
          placeholder="Search terms"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Search
        </Button>
      </Stack>
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

export default Interests;
