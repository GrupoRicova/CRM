import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, SimpleGrid, Text, VStack,Image, Button, Stack, Avatar,useColorModeValue, Modal,ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton  } from '@chakra-ui/react';
import Link from 'next/link';

interface AdSectionProps {
  title: string;
  data: Record<string, any>;
}

interface Interest {
  id: string;
  name: string;
  // Add more properties if needed
}

interface Behavior {
  id: string;
  name: string;
  // Add more properties if needed
}
interface Industry {
  id: string;
  name: string;
  
  // Add more properties if needed
}

interface Targeting {
  age_min: number;
  age_max: number;
  flexible_spec: Array<{
    interests: Interest[];
    behaviors: Behavior[];
    industries: Industry[];
    // Add more properties if needed
  }>;
  geo_locations: any; // Adjust the type according to your requirements
}
interface Insight {
  impressions: number;
  spend: number;
  clicks: number;
  reach: number;
  cpm: number;
  ctr: number;
  frequency: number;
  date_start: string;
  date_stop: string;
  // Add more properties if needed
}

interface InsightItemProps {
  insight: Insight;
}
const AdSection: React.FC<AdSectionProps> = ({ title, data }) => (
  <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md" bg="gray.200" my={4}>
    <Heading as="h2" size="md" mb={2}>
      {title}
    </Heading>
    {data &&
      Object.entries(data).map(([key, value]) => (
        <Text key={key}>
          {key}: {value}
        </Text>
      ))}
  </Box>
);

const TargetingDetails: React.FC<{ targeting: Targeting }> = ({ targeting }) => {
  const { age_min, age_max, flexible_spec, geo_locations } = targeting;
  const interests = flexible_spec[0]?.interests || [];
  const behaviors = flexible_spec[0]?.behaviors || [];
  const industries = flexible_spec[0]?.industries || [];
  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Targeting Details
      </Heading>

      <SimpleGrid columns={2}>
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Age Range:
          </Heading>
          <p>
            {age_min} - {age_max}
          </p>
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Interests:
          </Heading>
          {flexible_spec[0]?.interests.map((interest: Interest) => (
            <p key={interest.id}>{interest.name}</p>
          ))}
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Behaviors:
          </Heading>
          {flexible_spec[0]?.behaviors.map((behavior: Behavior) => (
            <p key={behavior.id}>{behavior.name}</p>
          ))}
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Industries:
          </Heading>
          {flexible_spec[0]?.industries.map((industry: any) => (
            <p key={industry.id}>{industry.name}</p>
          ))}
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Geo Locations:
          </Heading>
          <Box>
            {geo_locations.cities.map((city: any) => (
              <p key={city.key}>{city.name}</p>
            ))}
          </Box>
          <Box>
            {geo_locations.regions.map((region: any) => (
              <p key={region.key}>{region.name}</p>
            ))}
          </Box>
          <Box>
            {geo_locations.location_types.map((locationType: any) => (
              <p key={locationType}>{locationType}</p>
            ))}
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
const InsightItem: React.FC<InsightItemProps> = ({ insight }) => (
  <Box borderWidth="1px" borderRadius="md" p={4} boxShadow="md" bg="dark" mb={4}>
    <p>
      <strong>Impressions:</strong> {insight.impressions}
    </p>
    <p>
      <strong>Spend:</strong> {insight.spend}
    </p>
    <p>
      <strong>Clicks:</strong> {insight.clicks}
    </p>
    <p>
      <strong>Reach:</strong> {insight.reach}
    </p>
    <p>
      <strong>CPM:</strong> {insight.cpm}
    </p>
    <p>
      <strong>CTR:</strong> {insight.ctr}
    </p>
    <p>
      <strong>Frequency:</strong> {insight.frequency}
    </p>
    <p>
      <strong>Date Start:</strong> {insight.date_start}
    </p>
    <p>
      <strong>Date Stop:</strong> {insight.date_stop}
    </p>
  </Box>
);


interface Attachment {
  name: string;
  description: string;
  // Add more properties if needed
}

interface LinkData {
  child_attachments: Attachment[];
  // Add more properties if needed
}

interface ObjectStorySpec {
  page_id: string;
  link_data: LinkData;
  page_welcome_message: string;
  // Add more properties if needed
}

interface Creative {
  name: string;
  object_story_spec: ObjectStorySpec;
  thumbnail_url: string;
  // Add more properties if needed
}

interface CreativeDetailsProps {
  creative: Creative;
}

const CreativeDetails: React.FC<CreativeDetailsProps> = ({ creative }) => {
  const { name, object_story_spec, thumbnail_url } = creative;
  const { page_id, link_data, page_welcome_message } = object_story_spec;

  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Creative Details
      </Heading>

      <SimpleGrid columns={2} spacing={10}>
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Name:
          </Heading>
          <p>{name}</p>
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Page ID:
          </Heading>
          <p>{page_id}</p>
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Thumbnail:
          </Heading>
          <Image src={thumbnail_url} alt="Thumbnail" w="100px" h="100px" />
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Link Data:
          </Heading>
          <Box>
            <Heading as="h4" size="xs" mb={2}>
              Child Attachments:
            </Heading>
            {link_data.child_attachments.map((attachment) => (
              <Box key={attachment.name} mb={4}>
                <Heading as="h5" size="xs" mt={2}>
                  {attachment.name}
                </Heading>
                <p>{attachment.description}</p>
              </Box>
            ))}
          </Box>
        </Box>

        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Page Welcome Message:
          </Heading>
          <p>{page_welcome_message}</p>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
interface AdsPageProps {
  accountId: string;
}

const Index: React.FC<AdsPageProps> = ({ accountId }) => {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/marketing/ads/account/${accountId}`);
       
        setAds(response.data.data);
        
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    fetchData();
  }, [accountId]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode | null>(null);

  const handleButtonClick = (component: React.ReactNode) => {
    setSelectedComponent(component);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedComponent(null);
    setIsOpen(false);
  };
  console.log(ads)
  const bgcolor= useColorModeValue('white', 'gray.900')
  return (
    <SimpleGrid columns={3}>
       
      {ads.map((ad) => {
        console.log(ad)
        return(
        <Box key={ad.id}>
          <Box
        maxW={'320px'}
        w={'full'}
        bg={bgcolor}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}>
        <Avatar
          size={'xl'}
          src={
            ad.creative.thumbnail_url
          }
       
          mb={4}
          pos={'relative'}
          _after={{
            content: '""',
            w: 4,
            h: 4,
            bg: 'green.300',
            border: '2px solid white',
            rounded: 'full',
            pos: 'absolute',
            bottom: 0,
            right: 3,
          }}
        />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
        Ad Name: {ad.name}
        </Heading>
        

       

        <Stack mt={8} direction={'row'} spacing={4}>
         
        <Button
  flex={1}
  fontSize={'sm'}
  rounded={'full'}
  bg={'yellow.600'}
  color={'white'}
  boxShadow={
    '0px 1px 10px -5px rgb(250, 200, 0), 0 5px 5px -5px rgb(250, 200, 0)'
  }
  _hover={{
    bg: 'yellow.700',
  }}
  _focus={{
    bg: 'yellow.700',
  }}
  onClick={() => handleButtonClick(<InsightItem insight={ad.insights.data[0]} />)}
>
  Insights
</Button>

<Button
  flex={1}
  fontSize={'sm'}
  rounded={'full'}
  bg={'yellow.600'}
  color={'white'}
  boxShadow={
    '0px 1px 10px -5px rgb(250, 200, 0), 0 5px 5px -5px rgb(250, 200, 0)'
  }
  _hover={{
    bg: 'yellow.700',
  }}
  _focus={{
    bg: 'yellow.700',
  }}
  onClick={() => handleButtonClick(<TargetingDetails targeting={ad.targeting} />)}
>
  Targeting
</Button>

<Button
  flex={1}
  fontSize={'sm'}
  rounded={'full'}
  bg={'yellow.600'}
  color={'white'}
  boxShadow={
    '0px 1px 10px -5px rgb(250, 200, 0), 0 5px 5px -5px rgb(250, 200, 0)'
  }
  _hover={{
    bg: 'yellow.700',
  }}
  _focus={{
    bg: 'yellow.700',
  }}
  onClick={() => handleButtonClick(<CreativeDetails creative={ad.creative} />)}
>
  Creative
</Button>

        </Stack>
      </Box>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedComponent}
          </ModalBody>
        </ModalContent>
      </Modal>
        </Box>
      )})}
    </SimpleGrid>
  );
};


/*  <Heading as="h1" size="xl" mb={4}>
            Ad Name: {ad.name}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
          {ad.insights?.data && (
            <>
               <InsightItem insight={ad.insights.data[0]} />
               <TargetingDetails targeting={ad.targeting}/>
               <CreativeDetails creative={ad.creative} />
               </>
            )}
          </SimpleGrid>*/ 
export default Index;
