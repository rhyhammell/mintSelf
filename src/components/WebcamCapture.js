import { useState, useRef, useCallback } from 'react'
import { observer } from "mobx-react"
import Webcam from "react-webcam";
import { VStack, Box, Square, Button, Image, Text, Heading } from '@chakra-ui/react'
import { FaCamera, FaRedo } from 'react-icons/fa'


const WebcamCapture = ({ size, store }) => {
  const webcamRef = useRef(null);
  const [isError, setIsError] = useState(false)

  const capture = useCallback(() => {
    store.setImage(webcamRef.current.getScreenshot())
  }, [webcamRef]);

  const retake = () => {
    store.setImage('');
  }

  return (
    <VStack
      w={size}
      mx='auto'
    >
      <Square
        size={size}
        bg='gray.100'
      >
        {isError ?
          <Box p={10}>
            <VStack spacing={4}>
              <Heading color={'blue.400'} >Uh-oh!</Heading>
              <Text align='center'>Your webcam is being blocked.</Text>
              <Text align='center'>Update your browser settings to enable webcam usage and refesh this page.</Text>
            </VStack>
          </Box> :
          store.image ?
            <Image src={store.image} /> :
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={{ aspectRatio: 1 }}
              onUserMediaError={() => setIsError(true)}
            />
        }
      </Square>
      <Button
        colorScheme='blue'
        isFullWidth={true}
        disabled={isError}
        onClick={store.image ? retake : capture}
        leftIcon={store.image ? <FaRedo /> : <FaCamera />}
        variant={store.image ? 'outline' : 'solid'}
      >
        {store.image ? 'Retake' : 'Capture Image'}
      </Button>
    </VStack>
  )
}

export default observer(WebcamCapture)