import { useState } from 'react';
import axios from 'axios';

import { Box, Button, Checkbox, Input, Stat, StatGroup, StatHelpText, StatLabel, StatNumber, VStack ,useColorModeValue,Flex,SimpleGrid,useColorMode} from '@chakra-ui/react';
import { FaChartLine, FaDollarSign, FaMousePointer, FaShoppingCart, FaUserFriends, FaPercent, FaMoneyBill, FaBalanceScale, FaMoneyCheckAlt } from 'react-icons/fa';
const fieldOptions = [
  { value: 'impressions', label: 'Impressions', icon: <FaChartLine size={'3em'} /> },
  { value: 'spend', label: 'Spend', icon: <FaDollarSign size={'3em'} />},
  { value: 'clicks', label: 'Clicks', icon: <FaMousePointer size={'3em'} /> },
  { value: 'conversions', label: 'Conversions', icon: <FaShoppingCart size={'3em'} /> },
  { value: 'reach', label: 'Reach', icon: <FaUserFriends size={'3em'} /> },
  { value: 'cpm', label: 'CPM', icon: <FaPercent size={'3em'} /> },
  { value: 'cpc', label: 'CPC', icon: <FaMoneyBill size={'3em'} /> },
  { value: 'cpp', label: 'CPP', icon: <FaBalanceScale size={'3em'} /> },
  { value: 'cost_per_conversion', label: 'Cost Per Conversion', icon: <FaMoneyCheckAlt size={'3em'} /> },
];
interface StatsCardProps {
  title: string;
  stat: string;
  icon: any;
}
function StatsCard(props: StatsCardProps) {
  const { colorMode } = useColorMode();
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      >
      <Flex justifyContent={'space-between'} >
      <Box
          my={'auto'}
         
          alignContent={'center'}>
          {icon}
        </Box>
        <Box p={4}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        
      </Flex>
    </Stat>
  );
}

function Index() {
  const [selectedFields, setSelectedFields] = useState<any>([]);
  const [timeRange, setTimeRange] = useState({ since: '', until: '' });
  const [insights, setInsights] = useState([]);

  const handleSearch = async () => {
    try {
      const fields = selectedFields.join(',');
      const response = await axios.post('/api/marketing/act_741292430975362', {
        time_range: timeRange,
        fields: fields,
      });
      console.log(response);
      const data = response.data;
      setInsights(data.data);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFields((prevFields:any) => [...prevFields, value]);
    } else {
      setSelectedFields((prevFields:any) => prevFields.filter((field:any) => field !== value));
    }
  };
  ;

  return (
    <VStack align="center" spacing={4}>
   <VStack align="start" spacing={2}>
        {fieldOptions.map((field) => (
          <Checkbox
            key={field.value}
            value={field.value}
            isChecked={selectedFields.includes(field.value)}
            onChange={handleFieldChange}
          >
            {field.label}
          </Checkbox>
        ))}
      </VStack>
      <Box>
        <Input
          type="date"
          placeholder="Since"
          value={timeRange.since}
          onChange={(e) => setTimeRange((prevRange) => ({ ...prevRange, since: e.target.value }))}
          size="lg"
          borderRadius="md"
        />
        <Input
          type="date"
          placeholder="Until"
          value={timeRange.until}
          onChange={(e) => setTimeRange((prevRange) => ({ ...prevRange, until: e.target.value }))}
          size="lg"
          borderRadius="md"
        />
      </Box>
      <Button onClick={handleSearch} colorScheme="teal" size="lg" borderRadius="md">
        Search
      </Button>
      <Box>
        {insights.map((insight,key) => (
        
            <Box  key={key}maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>

            
              {selectedFields.map((field: string) => {
  const capitalS = field.charAt(0).toUpperCase() + field.slice(1);
  const selectedFieldOption = fieldOptions.find((option) => option.value === field);

  if (!selectedFieldOption) return null;

  return (
    <StatsCard
      key={field}
      title={capitalS}
      stat={insight[field]}
      icon={selectedFieldOption.icon}
    />
  );
})}
              </SimpleGrid>
            </Box>
          
        ))}
      </Box>
    </VStack>
  );
}

export default Index
