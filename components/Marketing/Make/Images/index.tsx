import { useState, useEffect } from 'react';
import { Box, Flex, Image, Button } from '@chakra-ui/react';
import axios from 'axios';
import md5 from 'md5';

const PropertyCarousel = () => {
  const [properties, setProperties] = useState<any>([]);
  const [selectedImages, setSelectedImages] = useState<any>([]);

  useEffect(() => {
    // Fetch properties from the API endpoint
    axios.get('/api/properties').then((response) => {
      console.log(response.data.content);
      setProperties(response.data.content);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const handleImageSelect = (imageUrl:any) => {
    // Check if the image is already selected
    const isSelected = selectedImages.some((selectedImage:any) => selectedImage.url === imageUrl);

    if (isSelected) {
      // Image is already selected, remove it from the selection
      setSelectedImages(selectedImages.filter((selectedImage:any) => selectedImage.url !== imageUrl));
    } else {
      // Image is not selected, add it to the selection
      const imageHash = md5(imageUrl); // Generate image hash from URL
      setSelectedImages([...selectedImages, { url: imageUrl, hash: imageHash }]);
    }
  };

  const createAdCreative = () => {
    // Make a request to the backend API to create the carousel ad creative
    const imageUrls = selectedImages.map((image:any) => image.url);
    const imageHashes = selectedImages.map((image:any) => image.hash);

    axios.post('/api/marketing/ads/creatives', {
      title: 'Descubre tu hogar ideal',
      caption: 'Contáctanos para encontrar la propiedad perfecta para ti',
      imageUrls,
      imageHashes,
    }).then((response) => {
      const creativeId = response.data.creativeId;
      // Handle the created ad creative
      console.log(`Ad Creative created with ID: ${creativeId}`);
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <Box>
      <Flex wrap="wrap" justify="center" align="center">
        {properties.map((property:any) => (
          <Box key={property.id} p={4}>
            <Image
              src={property.title_image_full}
              alt={property.title}
              boxSize="200px"
              objectFit="cover"
              borderRadius="md"
              border={selectedImages.some((selectedImage:any) => selectedImage.url === property.title_image_full) ? '4px solid blue' : '2px solid transparent'}
              cursor="pointer"
              onClick={() => handleImageSelect(property.title_image_full)}
            />
          </Box>
        ))}
      </Flex>
      <Button mt={4} colorScheme="blue" onClick={createAdCreative} disabled={selectedImages.length === 0}>
        Create Ad Creative
      </Button>
    </Box>
  );
};

export default PropertyCarousel;
