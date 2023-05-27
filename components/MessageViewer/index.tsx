import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, StackDivider,useColorMode,Input, Button } from '@chakra-ui/react';
import axios from 'axios';

const Index = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations');
      const { data } = response;
      setConversations(data.conversations);
      console.log(data)
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId:any) => {
    try {
      const response = await axios.get(`/api/messages/${conversationId}`);
      const { data } = response;
      console.log(data)
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationClick = (conversationId:any) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await axios.post(`/api/conversations/${selectedConversation}/messages`, {
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const { colorMode } = useColorMode();
  const reversedMessages = [...messages].reverse();
  return (
    <Box display="flex">
    <VStack
      align="stretch"
      spacing={0}
      divider={<StackDivider borderColor="gray.200" />}
      width="300px"
    >
      {conversations.length === 0 ? (
        <Text>No conversations found.</Text>
      ) : (
        conversations.map((conversation:any) => (
          <Box
            key={conversation.id}
            p={2}
            cursor="pointer"
            bg={colorMode === 'dark' ? 'gray.700' : 'white'}
            color={colorMode === 'dark' ? 'white' : 'black'}
            _hover={{ bg: 'gray.100' }}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <Box display="flex" alignItems="center">
              <Box
                borderRadius="full"
                boxSize="30px"
                overflow="hidden"
                marginRight={2}
              >
              
              </Box>
              <Text>{conversation.participants.data[0].name}</Text>
            </Box>
          </Box>
        ))
      )}
    </VStack>
    <VStack align="stretch" spacing={4} p={4} flex={1}>
      {reversedMessages.length === 0 ? (
        <Text>No messages found.</Text>
      ) : (
        reversedMessages.map((message:any, index:any) => (
          <Box key={message.id} p={2}  bg={colorMode === 'dark' ? 'gray.600' : 'white'}
          color={colorMode === 'dark' ? 'white' : 'black'} borderRadius="md">
          <Text fontWeight="bold">{message.from.name}</Text>
          <Text>{message.message}</Text>
        </Box>
        ))
      )}
      <Box display="flex" alignItems="center">
        <Input
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Box>
    </VStack>
  </Box>
);
};

export default Index;
