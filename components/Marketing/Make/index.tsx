import React, { useState } from 'react';
import { Box, HStack, Button } from '@chakra-ui/react';
import Behavior from './Search/Behavior';
import Interest from './Search/Interests';
import Geo from './Search/Geo';
import axios from 'axios';
import Images from './Images'
export default function Index() {
  const [behaviorState, setBehaviorState] = useState([]);
  const [interestState, setInterestState] = useState([]);
  const [geoState, setGeoState] = useState([]);

  const handleBehaviorChange = (selectedBehavior:any) => {
    setBehaviorState(selectedBehavior);
  };

  const handleInterestChange = (selectedInterest:any) => {
    setInterestState(selectedInterest);
  };

  const handleGeoChange = (selectedGeo:any) => {
    setGeoState(selectedGeo);
  };

  const sendRulesToServer = async () => {
    console.log('start')
    const rules = {
      inclusions: {
        operator: 'and',
        rules: [
          {
            field: 'interests',
            operator: 'or',
            values: interestState,
          },
          {
            field: 'behaviors',
            operator: 'or',
            values: behaviorState,
          },
          {
            field: 'geo_locations',
            operator: 'or',
            values: geoState,
          },
        ],
      },
    };

    try {
      await axios.post('/api/marketing/audience/create', { rules });
      console.log('Rules sent successfully!');
    } catch (error) {
      console.error('Failed to send rules to the server:', error);
    }
  };

  return (
    <Box>
      <HStack>
       
        <Images/>
      </HStack>
      <HStack>
      <Behavior onChange={handleBehaviorChange} />
        <Interest onChange={handleInterestChange} />
        <Geo onChange={handleGeoChange} /> 
      </HStack>
      <Box>
        <Button onClick={sendRulesToServer}>Send Rules</Button>
      </Box>
    </Box>
  );
}
