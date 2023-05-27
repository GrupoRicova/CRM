import React, { useState,useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  useColorMode,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useToast,
  Select,
  HStack
} from '@chakra-ui/react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getMonth, getYear, setMonth, setYear, isSameDay } from 'date-fns';
import { useSession } from 'next-auth/react';
import CreateMeeting from '../../Tools/CreateMeeting'
import axios from 'axios'
import useSWR from 'swr';
import Week from '../Week'
interface Meeting {
  id: number;
  attributes: {
    ContactName: string;
    date: string;
    PropertyID: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    email: string | null;
    Time: string;
    Accepted: boolean | null;
    Stage: string | null;
    Comments: string | null;
  };
}
const Month = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const { data: session } = useSession();
  const currentMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: lastDayOfMonth });

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [currentValue, setCurrentValue] = useState<any>('Month')
   const [propertyID, setpropertyID] = useState([]);
   const [contact, setcontact] = useState([]);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [currentMonth2, setCurrentMonth2] = useState(startOfMonth(today)); // New state variable
const [selectedMeeting, setSelectedMeeting] = useState<Meeting>();

const handleViewMeeting = (meeting: React.SetStateAction<Meeting | undefined> ) => {
  setSelectedMeeting(meeting);
  setIsModalOpen2(true);
};
console.log(session?.user)
const { data: meetings, mutate } = useSWR('http://localhost:1337/api/meetings', fetcher);

async function fetcher(url: string) {
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching meetings');
  }
}
console.log(meetings);

const handleDateClick = (date: Date | React.SetStateAction<null>| any) => {
  setSelectedDate((prevDate: null | Date | any ) => {
    if (date instanceof Date) {
      return date;
    } else {
      return prevDate;
    }
  });
  setIsModalOpen(true);
};




  if (!meetings) {
    return <div>Loading...</div>;
  }


  const handleChangeMonth = (event: { target: { value: string; }; }) => {
    const month = parseInt(event.target.value);
    setCurrentDate(setMonth(currentDate, month));
  };

  const handleChangeYear = (event: { target: { value: string; }; }) => {
    const year = parseInt(event.target.value);
    setCurrentDate(setYear(currentDate, year));
  };
  const handleGoToToday = () => {
    const month =startOfMonth(today);
console.log(month)
    setCurrentDate(month);
    console.log(currentDate)
    };
const handleCurrentV = (e: { preventDefault: () => void; target: { value: any; }; }) => {
  e.preventDefault()
  setCurrentValue(e.target.value)
  console.log(currentValue)
}


  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      color={colorMode === 'dark' ? 'white' : 'black'}
      p={4}
      borderRadius="md"
      boxShadow="md"
      overflowX="auto"
    >
      <Select onChange={handleCurrentV} w={100} h={9}  bg={'yellow.100'} color={'black'}>
  <option value='Month'>Month</option>
  <option value='Week'>Week</option>
  <option value='Day'>Day</option>
</Select>
   
 {currentValue ==='Month' ?<>
 <HStack> <Text fontSize="xl" >{format(currentMonth, 'MMMM yyyy')}</Text>
     <Button onClick={handleGoToToday} colorScheme="blue" size="sm" >Today</Button>
     
     </HStack>
    
 
 <Grid templateColumns="repeat(7, 1fr)" gap={2}>
  <GridItem colSpan={7} textAlign="center">
    <Select value={getMonth(currentDate)} onChange={handleChangeMonth} w="auto" mr={2}>
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i} value={i}>
          {format(new Date(0, i), 'MMMM')}
        </option>
      ))}
    </Select>
    <Select value={getYear(currentDate)} onChange={handleChangeYear} w="auto">
      {Array.from({ length: 10 }, (_, i) => {
        const year = getYear(today) - 5 + i;
        return (
          <option key={year} value={year}>
            {year}
          </option>
        );
      })}
    </Select>
  </GridItem>
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayOfWeek) => (
    <GridItem key={dayOfWeek} textAlign="center" fontWeight="bold">
      {dayOfWeek}
    </GridItem>
  ))}
 {daysInMonth.map((day) => {
const meetingsOnDayUser = meetings.filter((meeting: Meeting) => {
  const meetingDate = new Date(meeting.attributes.date);
  return isSameDay(day, meetingDate) && meeting.attributes.email === session?.user?.email;
});
  const meetingsOnDayManager = meetings.filter((meeting:Meeting) => {
    const meetingDate = new Date(meeting.attributes.date);
    return isSameDay(day, meetingDate) 
  });

  return (
    <>
    <GridItem
      key={day.toISOString()}
      textAlign="left"
      bg={isSameMonth(day, currentMonth) ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : 'gray.200'}
      height="auto"
      maxHeight={500}
      width={'auto'}
      p={4}
    >
      <Text ml={2} mt={2} fontWeight={isToday(day) ? 'bold' : 'normal'} onClick={() => handleDateClick(day)} cursor="pointer">
        {format(day, 'd')} 
      </Text>
     {( session?.user && session?.user.frontrole==='Gerente'? <> {meetingsOnDayManager.map((meeting:Meeting) => (
        <Text
          key={meeting.id}
          mt={1}
          textAlign={'center'}
          fontWeight={isToday(day) ? 'bold' : 'normal'}
          onClick={() => handleViewMeeting(meeting)}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'outline' }}
        >
          {format(new Date(`1970-01-01T${meeting.attributes.Time}`), 'hh:mm a')}
        </Text>
      ))}</> :<>
     {meetingsOnDayUser.map((meeting:Meeting) => (
        <Text
          key={meeting.id}
          mt={1}
          textAlign={'center'}
          fontWeight={isToday(day) ? 'bold' : 'normal'}
          onClick={() => handleViewMeeting(meeting)}
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          _focus={{ outline: 'none', boxShadow: 'outline' }}
        >
          {format(new Date(`1970-01-01T${meeting.attributes.Time}`), 'hh:mm a')}
        </Text>
      ))}
     </>)}
    </GridItem>

    </>
  );
})}
</Grid>
 </>:<><Week initialDate={currentDate} meetings={meetings}/></>}
 




<CreateMeeting isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} date={false} />

<Modal isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Meeting Details</ModalHeader>
    <ModalCloseButton />
    {selectedMeeting && (
      <ModalBody>
        <Text>Contact Name: {selectedMeeting.attributes.ContactName}</Text>
        <Text>Property ID: {selectedMeeting.attributes.PropertyID}</Text>
        <Text>Meeting Time: {selectedMeeting.attributes.Time}</Text>
        <Text>Email: {selectedMeeting.attributes.email}</Text>
      </ModalBody>
    )}
    <ModalFooter>
      <Button colorScheme="blue" onClick={() => setIsModalOpen2(false)}>
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
</Box>
);
};

export default Month;
