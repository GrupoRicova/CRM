import { Box, Center,useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import companyLogo from '../../../public/ricovalogo.jpg'; // Replace with the path to your company logo image

const LoadingPage = () => {
    const { colorMode } = useColorMode();
  return (
    <Box height="100vh" bg={colorMode === 'dark' ? 'gray.800' : 'white'}
    color={colorMode === 'dark' ? 'white' : 'black'}>
      <Center height="100%">
        <motion.img
          src={'/ricovalogo.jpg'}
          alt="Company Logo"
          style={{ maxWidth: '50%', maxHeight: '50%' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </Center>
    </Box>
  );
};

export default LoadingPage;
