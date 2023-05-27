import { useState, useEffect, SetStateAction } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td,Button,HStack ,Center,  Box,
  Input,
  FormControl,
  FormLabel,
  useColorMode,
  useToast,
  Select,
  Flex,
  Spinner,} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link'
import moment from "moment-timezone";
import CreateMeeting from '../Tools/CreateMeeting'
import { useSession } from 'next-auth/react';

interface FilterBoxProps {
  onFilter: (filter: Filter) => void;
}
interface Filter {
  date?: Date|any;
  fromDate?: Date| any;
  toDate?: Date | any;
  // other filter properties
}

const FilterBox: React.FC<FilterBoxProps> = ({ onFilter }) => {
  const [filter, setFilter] = useState<Filter>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter(filter);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Flex justifyContent="space-between" alignItems="center">
       

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={filter.date} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>From</FormLabel>
            <Input type="date" name="fromDate" value={filter.fromDate} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>To</FormLabel>
            <Input type="date" name="toDate" value={filter.toDate} onChange={handleChange} />
          </FormControl>

          <Button type="submit" colorScheme="blue" ml={2}>
            Filter
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
interface Data {
  name: string;
  date: string;
}


const PAGE_SIZE = 50;
interface Contact {
    happened_at: string | undefined| any;
    property_id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    source:string;
  }
  interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }
  
  function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
    const [pageButtons, setPageButtons] = useState<JSX.Element[]>([]);
  
    function generatePageButtons() {
      const newPageButtons: JSX.Element[] = [];
  
      const maxButtons = 5;
      const middle = Math.ceil(maxButtons / 2);
      let start = currentPage - middle + 1;
      let end = currentPage + middle - 1;
  
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
          <Button
            key="first"
            size="sm"
            onClick={() => onPageChange(1)}
          >
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
            colorScheme={isActive ? "blue" : "gray"}
            variant={isActive ? "solid" : "outline"}
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
    }, [currentPage, totalPages]);
  
    return <HStack>{pageButtons}</HStack>;
  }
  
  
export default function Index() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredData, setFilteredData] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const [loading,setloading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/contacts?page=${page}`);
        const { content,pagination} = response.data;
        console.log(content)
        setContacts(content);
        setTotalPages(pagination.total/PAGE_SIZE);
        console.log(pagination.total/PAGE_SIZE)
      } catch (error) {
        console.error(error);
      }
    }
    setloading(true)
    fetchData();
  }, [ page]);

  function handlePageChange(newPage: SetStateAction<number>) {
    router.push(`/contacts/?page=${newPage}`);
    setPage(newPage);
  }


  const handleFilter = (filter: Filter) => {
    let result = contacts;
    console.log(filter);
    console.log(result);
  
    if (filter.date) {
      const filterDate = moment(filter.date).tz("UTC").startOf("day");
    
      const filteredContacts = result.filter((contact) => {
        const contactDate = moment(contact.happened_at).tz("America/Mexico_City").startOf("day");
        return contactDate.format("YYYY-MM-DD") === filterDate.format("YYYY-MM-DD");
      });
    console.log(filteredContacts)
      setContacts(filteredContacts);
    }
  
    if (filter.fromDate && filter.toDate) {
      const fromDate = moment(filter.fromDate).tz("UTC").startOf("day");
      const toDate = moment(filter.toDate).tz("UTC").startOf("day");
    
      const filteredContacts = result.filter((contact) => {
        const contactDate = moment(contact.happened_at).tz("America/Mexico_City").startOf("day");
        return contactDate.isBetween(fromDate, toDate, null, '[]');
      });
    console.log(filteredContacts)
      setContacts(filteredContacts);
    }
    
  
   console.log(contacts)
   
  };
  const { colorMode } = useColorMode();
  const [Contact,setcontact] = useState('')
  const [Property,setproperty] = useState('')
  const toast = useToast();
const handleModal= (contact: SetStateAction<string>,property: SetStateAction<string>) => {
  setIsModalOpen(true)
  setcontact(contact)
  setproperty(property)
}

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
    <>
    <Box overflowX="auto" bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      p={4}
      borderRadius="md"
      boxShadow="md">
    <FilterBox onFilter={handleFilter} />
    <Box maxW="100%" overflowX="auto">
    <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Property id</Th>
            <Th>Message</Th>
            <Th>Source</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contacts.map((contact) => (
            <Tr key={contact.property_id}>
              <Td>{contact.name}</Td>
              <Td>{contact.email}</Td>
              <Td>{contact.phone}</Td>
              <Td><Link href={`/property/${contact.property_id}`}>{contact.property_id}</Link></Td>
              <Td>{contact.message}</Td>
              <Td>{contact.source}</Td>
              <Td>{contact.happened_at}</Td>
              <Td><Button onClick={() => handleModal(contact.name,contact.property_id)} >Agendar Cita</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
      
      </Box>
      <Center>
      <div>     
      <Pagination
      totalPages={totalPages}
      currentPage={page}
      onPageChange={handlePageChange}
    />
    <CreateMeeting isOpen={isModalOpen} date={true} onClose={() => setIsModalOpen(false)}  contactName={Contact} property={Property} />

    </div>
      </Center>
    </>
  );
}
