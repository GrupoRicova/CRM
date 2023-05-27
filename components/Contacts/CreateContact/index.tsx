import React, { FormEvent } from 'react';
import { FormControl, Input, FormLabel, Button } from '@chakra-ui/react';

export default function Index() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    let data = {
      Name: (target.name as unknown as HTMLInputElement).value,
      contact: (target.contact as HTMLInputElement).value,
      phoneNumber: (target.phone as HTMLInputElement).value,
      notes: (target.notes as HTMLInputElement).value,
      date: (target.date as HTMLInputElement).value,
      PropertyID: (target.propertyid as HTMLInputElement).value,
    };

    // Rest of your code
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Contact Name</FormLabel>
          <Input name="name" />
        </FormControl>
        <FormControl>
          <FormLabel>Contact Email</FormLabel>
          <Input name="contact" />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phone" />
        </FormControl>
        <FormControl>
          <FormLabel>Property ID</FormLabel>
          <Input name="propertyid" />
        </FormControl>
        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Input name="notes" />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input name="date" />
        </FormControl>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
