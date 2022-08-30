import { useMoralis } from 'react-moralis'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

const WarningMenu = () => {
  const [ connectError, setConnectError ] = useState(false)
  const { isInitialized, Moralis } = useMoralis()

  useEffect( async () => {
    if (isInitialized) {
      try {
        const appId = Moralis.applicationId;
        const serverURL = Moralis.serverURL;
        await Moralis.start({appId: appId, serverUrl: serverURL})
      } catch(e) {
        setConnectError(true)
      }
    }
  }, [isInitialized]);

  if (connectError) {
    return (
      <Alert status='error' mb={4}>
        <AlertIcon />
        <AlertTitle mr={2}>Moralis Not Initialized!</AlertTitle>
        <AlertDescription>Bad Moralis server configuration. Please fix before using this DApp. </AlertDescription>
      </Alert>
    )
  } else {
    return null 
  }
}

export default WarningMenu