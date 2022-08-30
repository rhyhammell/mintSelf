import React from 'react'
import ReactDOM from 'react-dom'
import { MoralisProvider } from 'react-moralis'
import { ChakraProvider } from '@chakra-ui/react'
import App from './components/App';

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
  <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID} >
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </MoralisProvider>,
  document.getElementById('root')
);