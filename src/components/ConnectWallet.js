import { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Button, useToast } from '@chakra-ui/react'
import { showErrorToast } from '../helpers/notifications'

const ConnectWallet = () => {
  const { authenticate, isAuthenticated, account, logout, hasAuthError, authError } = useMoralis()
  const toast = useToast()

  useEffect(() => {
    if (hasAuthError && authError.message == 'Non ethereum enabled browser') 
      showErrorToast(
        toast, 
        'AuthError', 
        'MetaMask Required!', 
        'Please install MetaMask to connect your wallet!'
      )
  }, [hasAuthError]);

  return (
    <Button
      size='lg'
      w='250px'
      colorScheme={'blue'}
      onClick={isAuthenticated ? logout : () => authenticate({signingMessage: "Authentication required for NFT minting."}) }
      variant={isAuthenticated ? 'outline' : 'solid'}
    >
      {(!isAuthenticated || !account) ?
        'Connect Wallet' :
        account.slice(0,6) + '...' + account.slice(-6)
      }
    </Button>
  )
}

export default ConnectWallet