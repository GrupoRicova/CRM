import React from 'react'
import Insights from './Insights'
import AdsAccount from './AdsAccount'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Index() {
  return (
    <>
    <Tabs isFitted  variant='soft-rounded' colorScheme='yellow'>
  <TabList>
    <Tab>View Account Stats</Tab>
    <Tab>View Ads</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Insights/>
    </TabPanel>
    <TabPanel>
    <AdsAccount accountId='act_741292430975362'/>
    </TabPanel>
  </TabPanels>
</Tabs>
    
    
    </>
  )
}
