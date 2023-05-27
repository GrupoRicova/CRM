import React, { useState, FormEvent, useEffect } from 'react';
import {
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
  Text,
  Select,
  useToast
} from '@chakra-ui/react';

import PropertySelect from '../PropertySelect'
import ContactSelect from '../ContactSelect'
import axios from 'axios'
import { SessionProvider, useSession, getSession } from 'next-auth/react';
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  
 
  contactName?: string;
  property?: string;
  date:boolean;
}

const Index: React.FC<CustomModalProps> = ({ isOpen, onClose,  contactName,date,property }) => {
  const [contact, setContact] = useState('');
  const [propertyID, setPropertyID] = useState('');
  const [datet, setdatet] = useState<any>('');
  const [meetingTime, setMeetingTime] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [useremail, setUserEmail] = useState<string>('');
  const [role, setRole] = useState<any>('');
  const toast = useToast();

  const handleSelectProperty = (e: { value: React.SetStateAction<string>; }) => {
    setPropertyID(e.value);
  };

  const handleSelectContact = (e: { label: React.SetStateAction<string>; }) => {
    setContact(e.label);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await getSession();
    const data = {
      date: datet,
      ContactName: contact,
      PropertyID: propertyID,
      Time: (e.target as HTMLFormElement).querySelector<HTMLInputElement>('#meetingTime')?.value,
      email: (role === 'Gerente') ? useremail : user?.user?.email,
      Stage: 'Meeting'
    };
    axios
      .post('http://localhost:1337/api/meetings', {data:data})
      .then((response) => {
        if (response) {
          toast({
            title: 'Meeting Scheduled',
            description: 'The meeting has been scheduled successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          onClose(); // Close the modal or perform any other necessary actions
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
  };

  useEffect(() => {
    const getUserRole = async () => {
      const user = await getSession();
      setRole(user?.user?.frontrole);
    };

    const getUsers = async () => {
      const response = await axios.get("http://localhost:1337/api/users");
      setUsers(response.data);
    };

    getUserRole();
    getUsers();
  }, []);

  useEffect(() => {
    if (contactName) {
      setContact(contactName);
    }

    if (property) {
      setPropertyID(property);
    }

    if (date) {
      setdatet(date);
    }
  }, [contactName, property, date]);
  return (
    <>
    {role === "Gerente" ? <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Meeting</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleFormSubmit}>
          <ModalBody>
            {date ?<> <FormControl id="Date" isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={datet} onChange={(e)=> setdatet(e.target.value)} />
          </FormControl></>: <></>}
            <FormControl id="contactName" isRequired>
              <FormLabel>Contacto</FormLabel>
              {contactName ? <><Text>{contactName}</Text></>:   <ContactSelect onSelect={handleSelectContact} />}
           
            </FormControl>
            <FormControl id="propertyId" isRequired mt={4}>
              <FormLabel>ID de la propiedad</FormLabel>  
              {property ? <><Text>{property}</Text></>:     <PropertySelect onSelect={handleSelectProperty}/>}

           
            </FormControl>
            <FormControl id="meetingTime" isRequired mt={4}>
            <FormLabel>Hora de la Cita</FormLabel>
              <Input type="time" step={'1'} value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
            </FormControl>
            <FormControl id="user" isRequired mt={4}>
            <FormLabel>Asesor</FormLabel>
            <Select placeholder='Select option' onChange={(e) => setUserEmail(e.target.value)}>
 
                {users.map(user=> {
                  return(<>
                   <option value={user.email}>{user.email}</option>
                  </>)
                })}
</Select>
</FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              Schedule
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
    </>: <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Meeting</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleFormSubmit}>
          <ModalBody>
            {date ?<> <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={datet} onChange={(e)=> setdatet(e.target.value)} />
          </FormControl></>: <></>}
            <FormControl id="contactName" isRequired>
              <FormLabel>Contact Name</FormLabel>
              {contactName ? <><Text>{contactName}</Text></>:   <ContactSelect onSelect={handleSelectContact} />}
            </FormControl>
            <FormControl id="propertyId" isRequired mt={4}>
              <FormLabel>Property ID</FormLabel>  
              {property ? <><Text>{property}</Text></>:     <PropertySelect onSelect={handleSelectProperty}/>}
            </FormControl>
            <FormControl id="meetingTime" isRequired mt={4}>
              <FormLabel>Meeting Time</FormLabel>
              <Input type="time" step={'1'} value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              Schedule
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
    </>}
    </>
  );
};

export default Index;
