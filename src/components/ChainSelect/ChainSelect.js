import { useEffect } from 'react'
import { useChain, useMoralis } from 'react-moralis'
import { 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button 
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import  chains from './ChainInfo'
import { observer } from "mobx-react"


const ChainSelect = ({ store }) => {
  const { switchNetwork, chainId  } = useChain();
  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    if (!chainId) return null;
    const newSelected = chains.find((item) => item.key === chainId);
    store.setChainInfo(newSelected ? newSelected : {})
  }, [chainId]);

  return (
    <Menu>
      <MenuButton
        as={Button} 
        w='full'
        rightIcon={<ChevronDownIcon />}
        leftIcon={isAuthenticated ? store.chainInfo?.icon : null}
        disabled={!isAuthenticated}
      >
        {store.chainInfo.value && isAuthenticated ? store.chainInfo.value : 'Select Network' }
      </MenuButton>
      <MenuList>
        {chains.map((item) => (
          <MenuItem 
            key={item.key} 
            icon={item.icon}
            onClick={() => switchNetwork(item.key)}
          >
            {item.value}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default observer(ChainSelect)