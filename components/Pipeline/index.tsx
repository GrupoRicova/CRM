import React, { useEffect, useState } from 'react';
import {  Box, HStack, Heading, Text ,useColorModeValue,Flex,Center} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios'
import { BsArrowUpRight, BsHeartFill, BsHeart } from 'react-icons/bs';
const MotionBox = motion(Box);
interface MeetingItem {
  id: string;
  attributes: {
    Stage: string;
    ContactName: string;
  };
}

const DragDropComponent = () => {
  const [meetings, setmeetings] = useState<MeetingItem[]>([]);
  const [Qualifies, setQualifies] = useState<MeetingItem[]>([]);
  const [Yes, setYes] = useState<MeetingItem[]>([]);
  const [No, setNo] = useState<MeetingItem[]>([]);
  const [liked, setLiked] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/meetings');
      console.log(response);
      setmeetings(
        response.data.data.filter((meeting: MeetingItem) => meeting.attributes.Stage === 'Meeting' && meeting.attributes.Stage !== null)
      );
      setQualifies(
        response.data.data.filter((qualifies: MeetingItem) => qualifies.attributes.Stage === 'Qualifies' && qualifies.attributes.Stage !== null)
      );
      setYes(
        response.data.data.filter((yes: MeetingItem) => yes.attributes.Stage === 'Yes' && yes.attributes.Stage !== null)
      );
      setNo(response.data.data.filter((no: MeetingItem) => no.attributes.Stage === 'No' && no.attributes.Stage !== null));
    } catch (error) {
      console.error('API request failed:', error);
    }
  };
 useEffect(() => {
   

    fetchData();
  }, []);
  const handleDragStart = (event: React.DragEvent<HTMLDivElement> | undefined | MouseEvent | TouchEvent | PointerEvent, item: MeetingItem, listId: string) => {
    if (!event) {
      return;
    }
    
    if ('dataTransfer' in event) {
      event.dataTransfer.setData('text/plain', JSON.stringify({ item, listId }));
    }
  };
  

  const handleDragOver = (event:React.DragEvent<HTMLDivElement> | undefined | MouseEvent | TouchEvent | PointerEvent) => {
    if (!event) {
      return;
    }
    event.preventDefault();
  };

const handleDrop = async (event:React.DragEvent<HTMLDivElement> | undefined | MouseEvent | TouchEvent | PointerEvent, destinationList: string) => {
  if (!event) {
    return;
  }
  event.preventDefault();
  const dragEvent = event as React.DragEvent<HTMLDivElement>;
  const data = JSON.parse(dragEvent.dataTransfer.getData('text/plain'));

  const { item, listId } = data;

  if (listId === destinationList) {
    return;
  }

  // Remove the item from its previous list
  let updatedList: MeetingItem[] = [];
  if (listId === 'Meeting') {
    updatedList = meetings.filter((listItem) => listItem.id !== item.id);
  } else if (listId === 'Qualifies') {
    updatedList = Qualifies.filter((listItem) => listItem.id !== item.id);
  } else if (listId === 'Yes') {
    updatedList = Yes.filter((listItem) => listItem.id !== item.id);
  } else if (listId === 'No') {
    updatedList = No.filter((listItem) => listItem.id !== item.id);
  }

  // Update the item's stage
  const updatedItem = { ...item, attributes: { ...item.attributes, Stage: destinationList } };

  // Update the destination list
  if (destinationList === 'Meeting') {
    setmeetings([...meetings, updatedItem]);
  } else if (destinationList === 'Qualifies') {
    setQualifies([...Qualifies, updatedItem]);
  } else if (destinationList === 'Yes') {
    setYes([...Yes, updatedItem]);
  } else if (destinationList === 'No') {
    setNo([...No, updatedItem]);
  }

  // Update the respective list with the modified data
  if (listId === 'Meeting') {
    setmeetings(updatedList);
  } else if (listId === 'Qualifies') {
    setQualifies(updatedList);
  } else if (listId === 'Yes') {
    setYes(updatedList);
  } else if (listId === 'No') {
    setNo(updatedList);
  }

  try {
    await axios.put(`http://localhost:1337/api/meetings/${item.id}`, {
      data: {
        ...item.attributes,
        Stage: destinationList,
      },
    });
    console.log('Meeting stage updated on the server.');
  } catch (error) {
    console.error(error);
  }
};



  const listItemVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  };

  return (
    <HStack spacing={4} align="center">
    <Box
        w="xs"
        rounded={'sm'}
        my={5}
        mx={[0, 5]}
        overflow={'hidden'}
      bg={useColorModeValue('lightgrey', 'grey.800')}
        border={'1px'}
        borderRadius="md"
        borderColor="black"
        boxShadow={useColorModeValue('6px 6px 0 teal', '6px 6px 0 teal')}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 'Meeting')}
        minH="md"
        >
    
          <Box
            bg="teal.500"
           
           
            py={1}
            color="white"
            mb={2}>
          <Center> <Text fontSize='md'  my={3}>
           Contactos en Cita</Text></Center>
          </Box>
           <Box
       
        w={300}
        p={4}
        bg={useColorModeValue('lightgrey', 'grey.800')}
      >
        
        {meetings.map((item) => (
          <MotionBox
            key={item.id}
            draggable
            onDragStart={(event) => handleDragStart(event, item, 'Meeting')}
            p={2}
            mb={2}
            bg="white"
            className='text-dark'
            borderRadius="md"
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.attributes.ContactName}
          </MotionBox>
        ))}
      </Box>
     
     
      </Box>
       <Box
        w="xs"
        rounded={'sm'}
        my={5}
        mx={[0, 5]}
        overflow={'hidden'}
        minH="md"
      bg={useColorModeValue('lightgrey', 'grey.800')}
        border={'1px'}
        borderColor="black"
        boxShadow={useColorModeValue('6px 6px 0 teal', '6px 6px 0 teal')}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 'Qualifies')}
        borderRadius="md"
        >
      
        
          <Box
            bg="teal.500"
           
           
            py={1}
            color="white"
            mb={2}>
          <Center> <Text fontSize='md' my={3}>
           Contacto califica para venta</Text></Center>
          </Box>
           <Box
       
        w={300}
        p={4}
        bg={useColorModeValue('lightgrey', 'grey.800')}
      >
        
     {Qualifies.map((item) => (
          <MotionBox
            key={item.id}
            draggable
            onDragStart={(event) => handleDragStart(event, item, 'Qualifies')}
            p={2}
            mb={2}
            bg="white"
            className='text-dark'
            borderRadius="md"
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          {item.attributes.ContactName}
          </MotionBox>
        ))}
      </Box>
        
      
      </Box>
      
         <Box
        w="xs"
        rounded={'sm'}
        my={5}
        mx={[0, 5]}
        overflow={'hidden'}
      bg={useColorModeValue('lightgrey', 'grey.800')}
        border={'1px'}
        borderColor="black"
        boxShadow={useColorModeValue('6px 6px 0 green', '6px 6px 0 green')}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 'Yes')}
        borderRadius="md"
        minH="md"
        >
      
      
          <Box
            bg="green.500"
           
           
            py={1}
            color="white"
            
            mb={2}>
          <Center> <Text fontSize='md' my={3}>
           Venta concretada</Text></Center>
          </Box>
           <Box
      
        w={300}
        p={4}
        bg={useColorModeValue('lightgrey', 'grey.800')}
      >
        
   {Yes.map((item) => (
          <MotionBox
            key={item.id}
            draggable
            onDragStart={(event) => handleDragStart(event, item, 'Yes')}
            p={2}
            mb={2}
            bg="white"
            borderRadius="md"
            className='text-dark'
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          {item.attributes.ContactName}
          </MotionBox>
        ))}
      </Box>
       
     
      </Box>
      <Box
        w="xs"
        rounded={'sm'}
        my={5}
        mx={[0, 5]}
        overflow={'hidden'}
      bg={useColorModeValue('lightgrey', 'grey.800')}
        border={'1px'}
        borderColor="black"
        boxShadow={useColorModeValue('6px 6px 0 red', '6px 6px 0 red')}
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 'No')}
        borderRadius="md"
        minH="md">
      
        
          <Box
            bg="red.500"
           
           
            py={1}
            color="white"
            mb={2}>
          <Center> <Text fontSize='md' my={3}>
           Venta No concretada</Text></Center>
          </Box>
           <Box
     
        w={300}
        p={4}
        bg={useColorModeValue('lightgrey', 'grey.800')}
      >
        
   {No.map((item) => (
          <MotionBox
            key={item.id}
            draggable
            onDragStart={(event) => handleDragStart(event, item, 'No')}
            p={2}
            mb={2}
            bg="white"
            borderRadius="md"
            className='text-dark'
            variants={listItemVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          {item.attributes.ContactName}
          </MotionBox>
        ))}
      </Box>
     
    
      </Box>
     
    </HStack>
  );
};



export default DragDropComponent;
