import { FC, useState } from 'react';
import { format, isToday, isSameDay, addDays, subDays, eachDayOfInterval } from 'date-fns';
import { Box, Button, Heading, Text, HStack, VStack,useColorMode } from '@chakra-ui/react';

interface Meeting {
  id: string;
  attributes: {
    date: string;
    Time: string;
    ContactName: string;
    PropertyID: string;
  };
}

interface DayViewProps {
  initialDate: Date;
  meetings: Meeting[];
}

const DayView: FC<DayViewProps> = ({ initialDate, meetings }) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const { colorMode } = useColorMode();  const weekStart = subDays(currentDate, 3);
  const weekEnd = addDays(currentDate, 3);
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getDayName = (date: Date) => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const dayIndex = date.getDay();
    return dayNames[dayIndex];
  };

  return (
    <VStack align="center">
      <Box>
        
        <HStack>
        <Button onClick={handlePrevWeek}>Previous Week</Button>
          <Heading size="md">{format(weekStart, 'MMMM d, yyyy')}</Heading>
          <Text>-</Text>
          <Heading size="md">{format(weekEnd, 'MMMM d, yyyy')}</Heading>
          <Button onClick={handleNextWeek}>Next Week</Button>
        </HStack>
        
      </Box>
     
      <HStack  align="center">
        
        {weekDates.map((date) => {
          const meetingsOnDay = meetings.filter((meeting) => isSameDay(date, new Date(meeting.attributes.date)));

          return (
            <VStack key={date.toISOString()} align="start"  bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
            color={colorMode === 'dark' ? 'white' : 'black'}p={4} borderRadius="md" >
             <Box key={date.toISOString()}  borderRadius="md" height={500} w={137}>
  <Heading as="h3" size="md" mb={2}>
    {getDayName(date)}
  </Heading>
  <Heading as="h3" size="md" mb={2}>
    {format(date, 'MMMM d, yyyy')}
  </Heading>
  <VStack spacing={2}>
    {meetingsOnDay.map((meeting) => (
      <Box key={meeting.id} borderWidth={1} p={2} borderRadius="md">
        <Text>{format(new Date(`1970-01-01T${meeting.attributes.Time}`), 'hh:mm a')}</Text>
        <Text>{meeting.attributes.ContactName}</Text>
        <Text>{meeting.attributes.PropertyID}</Text>
      </Box>
    ))}
    {meetingsOnDay.length === 0 && (
      <Text fontSize="sm" fontStyle="italic" color="gray.500">
        No meetings scheduled for this day.
      </Text>
    )}
  </VStack>
</Box>

            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default DayView;
