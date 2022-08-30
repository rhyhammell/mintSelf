import { useEffect } from 'react'
import { useMoralis } from "react-moralis"
import { Box, Heading, Flex, Container, Spacer, Text } from '@chakra-ui/react'

import WebcamCapture from './WebcamCapture'
import MintForm from './MintForm'
import ConnectWallet from './ConnectWallet'
import WarningMenu from './WarningMenu'

import AppStateStore from '../stores/AppStateStore'

const appStateStore = new AppStateStore()



function App() {
  const { enableWeb3, isWeb3Enabled, isWeb3EnableLoading, isAuthenticated } = useMoralis()

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3();
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Container
      maxW='container.lg'
      mt={{ base: 8, md: 32 }}
      mb={24}
    >
      <WarningMenu />

      <Flex
        justify={'center'}
        direction={{ base: 'column', md: 'row' }}
        alignContent={'center'}
      >
        <Box 
          mb={{ base: 8, md: 0 }} 
        >
          <WebcamCapture
            size={'400px'}
            store={appStateStore}
          />
        </Box>
        <Box 
          flex={1} 
          ml={{ base: 0, md: 4 }} 
        >
          <Flex mb={10}>
            <Box>
              <Heading>NFT-ME</Heading>
              <Heading size='md' color='gray.600'>Blockchain yourself.</Heading>
            </Box>
            <Spacer />
            <ConnectWallet />
          </Flex>
          <MintForm store={appStateStore} />
        </Box>
      </Flex>
    </Container>
  );
}

export default App;