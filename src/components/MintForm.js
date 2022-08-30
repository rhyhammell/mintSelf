import { useEffect, useState } from 'react'
import { useMoralisFile, useMoralis, useWeb3ExecuteFunction } from 'react-moralis'
import ChainSelect from './ChainSelect/ChainSelect'
import {
  FormControl,
  Input,
  Button,
  SimpleGrid,
  GridItem,
  useBreakpointValue,
  Box,
  Text,
  Link,
  Heading,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Center,
  Stack
} from '@chakra-ui/react'
import { observer } from "mobx-react"
import { showErrorToast } from '../helpers/notifications'
import contractInfo from './../contracts/contractInfo.json'

const MintForm = ({ store }) => {
  const [ isModalVisible, setIsModalVisible ] = useState(false)
  const [ isProcessingComplete, setIsProcessingComplete ] = useState(false)
  const [ processingStatus, setProcessingStatus ] = useState('')
  const [ tokenId, setTokenId ] = useState('')

  const { saveFile } = useMoralisFile();
  const { fetch } = useWeb3ExecuteFunction();
  const { isAuthenticated } = useMoralis();

  const toast = useToast()
  const colSpan = useBreakpointValue({ base: 2, sm: 1 })

  useEffect(() => {
    if (store.image) {
      const now = new Date()
      store.setName(`Me at ${now.toLocaleTimeString()}`)
      store.setDescription(`Captured at ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`)
    } else {
      store.setName('')
      store.setDescription('')
    }
  }, [store.image]);

  const mintNFT = async () => {
    if (!contractInfo.networks || !(store.chainInfo.id in contractInfo.networks)) {
      showErrorToast(
        toast,
        'ContractError',
        'Smart contract data missing!',
        'Failed to load smart contract data for this network. Minting can not be performed!'
      )
      return
    }

    try {
      setIsProcessingComplete(false);
      setIsModalVisible(true);

      // Load image to ipfs
      setProcessingStatus('Uploading image to IPFS...')
      const imageIpfs = await saveFile(
        "image.jpg",
        { base64: store.image },
        {
          saveIPFS: true,
          throwOnError: true
        }
      );

      // Create metadata and load to ipfs
      setProcessingStatus('Uploading metadata to IPFS...')
      const metadata = {
        name: store.name,
        description: store.description,
        image: `ipfs://${imageIpfs._hash}`
      }
      const metaIpfs = await saveFile(
        "metadata.json",
        { base64: btoa(JSON.stringify(metadata)) },
        {
          saveIPFS: true,
          throwOnError: true
        }
      );

      // Call mint function on contract
      setProcessingStatus('Requesting transaction signature...')
      const options = {
        abi: contractInfo.abi,
        contractAddress: contractInfo.networks[store.chainInfo.id].address,
        functionName: "mint",
        params: {
          uri: `ipfs://${metaIpfs._hash}`,
        },
      }
      const transaction = await fetch({
        params: options,
        throwOnError: true
      })

      setProcessingStatus('Transaction confirmation... (~15 sec)')
      const res = await transaction.wait({throwOnError: true})
      const event = res.events.find(event => event.event === 'Transfer');
      const [from, to, tokenId] = event.args;
      setTokenId(tokenId.toString())

      setIsProcessingComplete(true)
    } catch (e) {
      setIsModalVisible(false)
      showErrorToast(
        toast,
        'ProcessingError',
        'Error Minting!',
        e.message
      )
    }
  }

  return (
    <>
      <SimpleGrid
        columns={2}
        columnGap={3}
        rowGap={6}
        w='full'
      >
        <GridItem colSpan={2}>
          <Box>
            <Text>Capture an image from your webcam and fill in the details below.</Text>
            <Text>Mint it to the selected network as an NFT.</Text>
          </Box>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <Input
              placeholder='NFT Name'
              value={store.name}
              onChange={event => store.setName(event.currentTarget.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <Input
              placeholder='NFT Description'
              value={store.description}
              onChange={event => store.setDescription(event.currentTarget.value)}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={colSpan}>
          <ChainSelect store={store} />
        </GridItem>
        <GridItem colSpan={colSpan}>
          <Button
            colorScheme='blue'
            w='full'
            onClick={mintNFT}
            disabled={!store.isValidInputs || !isAuthenticated || store.isProcessing}
          >
            Mint NFT
          </Button>
        </GridItem>
      </SimpleGrid>
      <Modal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        closeOnOverlayClick={false}
        size='md'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign='center'
            pb={0}
          >
            {isProcessingComplete ? 'Minting Complete' : 'Minting NFT' }
          </ModalHeader>
          {isProcessingComplete && <ModalCloseButton />}
          <ModalBody
            p={12}
          >
            <Center>
              {isProcessingComplete ?
                <VStack>
                  <Text 
                    fontWeight={'bold'}
                    mb={4}
                  >
                    Woohoo! Your NFT has been minted!
                  </Text>
                  <Link 
                    href={`${store.chainInfo.opensea}/${contractInfo.networks[store.chainInfo.id].address}/${tokenId}`} 
                    color="blue"
                    isExternal
                  >
                    View on OpenSea
                  </Link>
                  <Link 
                    href={`${store.chainInfo.explorer}/address/${contractInfo.networks[store.chainInfo.id].address}`}
                    color="blue"
                    isExternal
                  >
                    View on BlockChain Explorer
                  </Link>
                </VStack>
                :
                <VStack>
                  <Spinner size='lg' />
                  <Text>{processingStatus}</Text>
                </VStack>
              }
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default observer(MintForm)