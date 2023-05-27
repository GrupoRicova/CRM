import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Text
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import {useSession,signIn,signOut} from 'next-auth/react'
import { MouseEventHandler } from 'react';
export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
 const { data: session } = useSession();
 console.log(session)


 const handleSignIn: MouseEventHandler<HTMLButtonElement> = async (event) => {
  event.preventDefault();
  await signIn();
}
  return (
    <>
      <Box   bg={colorMode === 'dark' ? 'gray.800' : 'yellow.400'}
      color={colorMode === 'dark' ? 'yellow' : 'black'}
      
    
      boxShadow="md"
      overflowX="auto" px={5}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box ><Link href='/'><Text>Ricova CRM</Text></Link></Box>
          <HStack spacing={8} alignItems={'center'}>
          </HStack>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {!session && (
               <Button onClick={() => signIn()}>
               Login
             </Button>
             
              )}

              {session && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'logo'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Text>{session?.user?.email}</Text>
                      <Text>{session?.user?.frontrole}</Text>
                    </Center>
                    <br />
                    <MenuDivider />
                   
                    <MenuItem>Settings</MenuItem>
                    <MenuItem onClick={() =>signOut()}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
