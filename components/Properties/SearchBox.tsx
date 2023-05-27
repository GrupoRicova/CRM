import { useState,useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import {
  Input,
  Button,
  Flex,
  Box,
  FormControl,
  FormLabel,

  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
useColorModeValue,
  Text,
  Image,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Select,
  useColorMode,
  Table, Thead, Tbody, Tr, Th, Td,HStack,
  Heading,
  useToast,
  Spinner,
  Stack,
  Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react';
import CreateMeeting from '../Tools/CreateMeeting'
import { useSession } from 'next-auth/react';
type SearchParams = {
  updated_after?: string;
  updated_before?: string;
  operation_type?: string;
  min_price?: string;
  max_price?: string;
  min_bedrooms?: string;
  min_bathrooms?: string;
  min_parking_spaces?: string;
  min_construction_size?: string;
  max_construction_size?: string;
  min_lot_size?: string;
  max_lot_size?: string;
}
import axios from 'axios'
import Link from 'next/link';
import LoadingPage from '../Tools/LoadingPage';

interface Commission {
  type: string;
}

interface Operation {
  amount: number;
  commission: Commission;
  currency: string;
  formatted_amount: string;
  type: string;
  unit: string;
}

interface Property {
  agent: string;
  bathrooms: null;
  bedrooms: null;
  construction_size: number;
  location: string;
  lot_size: number;
  operations: Operation[];
  parking_spaces: null;
  property_type: string;
  public_id: string;
  share_commission: boolean;
  show_prices: boolean;
  title: string;
  title_image_full: string;
  title_image_thumb: string;
  updated_at: string;
}


interface PaginationProps {
  totalPagesf: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}


const PAGE_SIZE = 20;

function Pagination({ totalPagesf, currentPage, onPageChange }: PaginationProps) {
  const [pageButtons, setPageButtons] = useState<JSX.Element[]>([]);

  function generatePageButtons() {
    const newPageButtons: JSX.Element[] = [];

    const maxButtons = 5;
    const middle = Math.ceil(maxButtons / 2);
    let start = currentPage - middle + 1;
    let end = currentPage + middle - 1;
    let totalPages = Math.floor(totalPagesf);
    console.log(totalPages)
    // Check if we're near the start or end of the pagination range
    if (start < 1) {
      end += Math.abs(start) + 1;
      start = 1;
    }

    if (end > totalPages) {
      start -= end - totalPages;
      end = totalPages;
    }

    // Add first and previous page buttons
    if (currentPage > 1) {
      newPageButtons.push(
        <Button key="first" size="sm" onClick={() => onPageChange(1)}>
          First
        </Button>
      );

      newPageButtons.push(
        <Button
          key="prev"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>
      );
    }

    // Add page buttons
    for (let i = start; i <= end; i++) {
      const isActive = i === currentPage;

      newPageButtons.push(
        <Button
          key={i}
          size="sm"
          colorScheme={isActive ? 'blue' : 'gray'}
          variant={isActive ? 'solid' : 'outline'}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add next and last page buttons
    if (currentPage < totalPages) {
      newPageButtons.push(
        <Button
          key="next"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      );

      newPageButtons.push(
        <Button
          key="last"
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      );
    }

    setPageButtons(newPageButtons);
  }

  useEffect(() => {
    generatePageButtons();
  }, [currentPage, totalPagesf]);

  return <HStack>{pageButtons}</HStack>;
}




 export default function SearchBox(){
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    console.log(value)
    await  setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
   
  };
  const [properties, setproperties] = useState<Property[]>([])
const [location, setlocation] = useState([])
const getLocations = async () => {
  const response = await axios.get('/api/locations')
  setlocation(response.data.locations)

}
  const handleNumberInputChange = async (name: string, value: string) => {
  
     await setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    const   updatedSearchParams =  {
      ...searchParams,
      [name]: value,
    };
  
   
  }
  function handlePageChange(newPage: number) {
    // Update the currentPage state if needed
    setPage(newPage);
  
    // Fetch properties based on the new page
    getProperties(newPage);
  
    // Update the URL or perform any necessary actions
    router.push(`/property/?page=${newPage}`);
  }
  
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setloading] = useState(false);
 
  const getProperties =async  (page:any) => {
    try {
      const response = await axios.get(`/api/properties?page=${page}`);
      const { content, pagination } = response.data;
      setproperties(content);
      console.log(pagination)
      setloading(true)
      setTotalPages(Math.ceil(pagination.total / PAGE_SIZE));
    } catch (error) {
      console.error(error);
    }
  }
  const [loc, setloc] = useState('')
  const [getbyloc, setgetbyloc] = useState(false)
  useEffect(() => {
    setloading(true)
    getLocations()
    getProperties(page)
  }, []);
  const handlechange = async () => {
    console.log(searchParams)
   if(getbyloc){
    const response = await axios.post(`http://localhost:3000/api/properties/location?location=${loc}`, searchParams,
    {
      timeout: 10000 
    }
    );
     console.log(response.data);
     await setproperties(response.data.properties);
   }else if(!getbyloc){
    const response = await axios.post('http://localhost:3000/api/properties', searchParams,
    {
      timeout: 10000 
    }
    );
     console.log(response.data);
      await setproperties(response.data.properties);
   }
   
  } 
  
  const handlelocation = (e: {target:any}) => {
    if(e.target.value !== '-'){
      setloc(e.target.value)
      setgetbyloc(true)
    }
   
    
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [contact, setcontact] = useState('');
 const [Property, setproperty] = useState('');
 const toast = useToast();
 const { data: session } = useSession();
 const handleSelectContact = (e: { label: SetStateAction<string>; }) => {
  setcontact(e.label)
  }
  const handleSubmit = (e: { preventDefault: () => void; target: { date: { value: any; }; meetingTime: { value: any; }; }; }) => {
    e.preventDefault();
    const data = {
      ContactName: contact,
      date: e.target.date.value,
      Time: e.target.meetingTime.value,
      email:session?.user?.email,
      PropertyID: Property
     
    }
    console.log(data)
    axios.post('http://localhost:1337/api/meetings', {data:data})
      .then((response) => {
        if (response) {
          toast({
            title: 'Meeting Scheduled',
            description: 'The meeting has been scheduled successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          setIsModalOpen(false);
        } else {
          throw new Error('Failed to schedule the meeting.');
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Error',
          description: 'An error occurred while scheduling the meeting.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
      
  }
  const handleModal= (property: SetStateAction<string>) => {
    setIsModalOpen(true)

    setproperty(property)
  }
  const Card = ({ publicId, imageUrl, title, location, price, operation, handleModal }:any) => {
    return (
     
        <Box
          maxW={'445px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}
        >
           <Link href="/property/[id]" as={`/property/${publicId}`}>
          <Box  position="relative"
        h={'210px'}
        bg={'gray.100'}
        mt={-6}
        mx={-6}
        mb={6}
      
        overflow="hidden"
        
        _hover={{ transform: 'scale(1.05)' }}
        >
            <Image src={imageUrl}  objectFit={'cover'}/>
          </Box>
          </Link>
          <Stack>
            <Text
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}
            >
              Property ID: {publicId}
            </Text>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}
            >
              {title}
            </Heading>
            <Text color={'gray.500'}>Location: {location}</Text>
            <Text color={'gray.500'}>Price: {price}</Text>
            <Text color={'gray.500'}>Operation: {operation}</Text>
          </Stack>
          <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
            <Box flex={1}></Box>
            <Box>
              <Button onClick={() => handleModal(publicId)}>Agendar Cita</Button>
            </Box>
          </Stack>
        </Box>
   
    );
  };
  
  if(loading === false){
    return(<>
   <div>
    <Center>
      <Spinner/>
    </Center>
   </div>
    </>)
  }
  return (
    <Box as="form"  >
      <Heading as='h6' >Propiedades</Heading >
      <Center my={10}>
      <FormControl mb="7" mx="3" w='300px'>
          <FormLabel htmlFor="operation_type">Operación</FormLabel>
          <Select id="operation_type" name="operation_type" onChange={handleInputChange}>
            <option value="">Select an option</option>
            <option value="sale">sale</option>
            <option value="rental">rental</option>
          </Select>
        </FormControl>
      <FormControl  mb="7" mx="3" w='300px'>
    <FormLabel >Ubicación</FormLabel>
      <Select onChange={handlelocation}>
      
        <option>-</option>
        {location.map(l => (<>
        <option key={l}>{l}</option>
        </>))}
      </Select>
    </FormControl>
      <Button colorScheme='yellow' onClick={onOpen}>
        Ver filtros
      </Button>
      <Button onClick={handlechange} mt={{ base: 4, md: 0 }} mx='4' colorScheme="yellow">
Buscar
</Button>
      </Center>
      
      <Drawer placement={'top'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
          <DrawerBody>
         
     <Flex direction={{ base: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between">
 
     
       
        <FormControl mb="4" mx="3">
          <FormLabel htmlFor="min_price">Price</FormLabel>
          <NumberInput id="min_price" name="min_price" onChange={(value) => handleNumberInputChange('min_price', value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl  mx="3" my="7">
          
          <NumberInput   id="max_price" name="max_price" onChange={(value) => handleNumberInputChange('max_price', value)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
</FormControl>
<FormControl mb="4" mx="3">
<FormLabel htmlFor="min_bedrooms">Min Bedrooms</FormLabel>
<NumberInput
id="min_bedrooms"
name="min_bedrooms"
onChange={(value) => handleNumberInputChange('min_bedrooms', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>
</Flex>
<Flex direction={{ base: 'column', md: 'row' }} alignItems="flex-start" justifyContent="space-between">
<FormControl mb="4" mx="3">
<FormLabel htmlFor="min_bathrooms">Min Bathrooms</FormLabel>
<NumberInput
id="min_bathrooms"
name="min_bathrooms"
onChange={(value) => handleNumberInputChange('min_bathrooms', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>

<FormControl mb="4" mx="3">
<FormLabel htmlFor="min_parking_spaces">Min Parking Spaces</FormLabel>
<NumberInput
id="min_parking_spaces"
name="min_parking_spaces"
onChange={(value) => handleNumberInputChange('min_parking_spaces', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>

<FormControl mb="4" mx="3">
<FormLabel htmlFor="min_construction_size">Min Construction Size (m²)</FormLabel>
<NumberInput
id="min_construction_size"
name="min_construction_size"
onChange={(value) => handleNumberInputChange('min_construction_size', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>
<FormControl mb="4" mx="3" >
<FormLabel htmlFor="max_construction_size">Max Construction Size (m²)</FormLabel>
<NumberInput
id="max_construction_size"
name="max_construction_size"
onChange={(value) => handleNumberInputChange('max_construction_size', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>
<FormControl mb="4" mx="3">
<FormLabel htmlFor="min_lot_size">Min Lot Size (m²)</FormLabel>
<NumberInput
id="min_lot_size"
name="min_lot_size"
onChange={(value) => handleNumberInputChange('min_lot_size', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>
<FormControl mb="4" mx="3">
<FormLabel htmlFor="max_lot_size">Max Lot Size (m²)</FormLabel>
<NumberInput
id="max_lot_size"
name="max_lot_size"
onChange={(value) => handleNumberInputChange('max_lot_size', value)}
>
<NumberInputField />
<NumberInputStepper>
<NumberIncrementStepper />
<NumberDecrementStepper />
</NumberInputStepper>
</NumberInput>
</FormControl>

</Flex>
<Center my='5'>
<Button onClick={handlechange} mt={{ base: 4, md: 0 }} colorScheme="yellow">
Search
</Button>
</Center>
     
          </DrawerBody>
        </DrawerContent>
      </Drawer>
   

<Box overflowX="auto"  bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      p={4}
      borderRadius="md"
      boxShadow="md">
        <Tabs isFitted variant='enclosed' colorScheme='yellow'>
  <TabList mb='1em'>
    <Tab>Cards</Tab>
    <Tab>Table</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <SimpleGrid columns={3} spacing={4}>
         {properties.map((property) => (
         
         
 <Card
          key={property.public_id}
          publicId={property.public_id}
          imageUrl={property.title_image_full}
          title={property.title}
          location={property.location}
          price={property.operations[0].formatted_amount}
          operation={property.operations[0].type}
          handleModal={handleModal}
        />
         
         
         ))}
         </SimpleGrid>
    </TabPanel>
    <TabPanel>
    <Table variant="simple">
        <Thead>
          <Tr>
          <Th>ID</Th>
            <Th>Titulo</Th>
            <Th>Ubicación</Th>
            <Th>Precio</Th>
            <Th>Operación</Th>
          
          </Tr>
        </Thead>
        <Tbody>
        {properties.map((property) => (
         
            <Tr key={property.public_id}>
              
              <Td>{property.public_id}</Td>
              
              <Link href="/property/[id]" as={`/property/${property.public_id}`}>
              <Td>{property.title}</Td>
              </Link>
              <Td>{property.location}</Td>
              <Td>{property.operations[0].formatted_amount}</Td>
              <Td>{property.operations[0].type === 'rental' ? <><Text>Renta</Text></>: <><Text>Venta</Text></>}</Td>
              <Td><Button onClick={() => handleModal(property.public_id)}>Agendar Cita</Button></Td>
            </Tr>
           
          ))}
        </Tbody>
      </Table>
    </TabPanel>
  </TabPanels>
</Tabs>
        
      
      </Box>

<Center>      <Pagination totalPagesf={totalPages} currentPage={page} onPageChange={handlePageChange} />
</Center>
<CreateMeeting isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} date={true} property={Property}  />

</Box>
);
};



        /*<Table variant="simple">
        <Thead>
          <Tr>
          <Th>ID</Th>
            <Th>Titulo</Th>
            <Th>Ubicación</Th>
            <Th>Precio</Th>
            <Th>Operación</Th>
          
          </Tr>
        </Thead>
        <Tbody>
        {properties.map((property) => (
         
            <Tr key={property.public_id}>
              
              <Td>{property.public_id}</Td>
              
              <Link href="/property/[id]" as={`/property/${property.public_id}`}>
              <Td>{property.title}</Td>
              </Link>
              <Td>{property.location}</Td>
              <Td>{property.operations[0].formatted_amount}</Td>
              <Td>{property.operations[0].type === 'rental' ? <><Text>Renta</Text></>: <><Text>Venta</Text></>}</Td>
              <Td><Button onClick={() => handleModal(property.public_id)}>Agendar Cita</Button></Td>
            </Tr>
           
          ))}
        </Tbody>
      </Table> */