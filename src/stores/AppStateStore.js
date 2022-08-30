import { makeAutoObservable } from 'mobx'

class AppStateStore {
  image = ''
  name = ''
  description = ''
  chainInfo = {}

  constructor() {
    makeAutoObservable(this)
  }

  setImage = image => {
    this.image = image
  }

  setName = name => {
    this.name = name
  }

  setDescription = description => {
    this.description = description
  } 

  setChainInfo = chainInfo => {
    this.chainInfo = chainInfo
  }

  get isValidInputs() {
    return this.image && this.name && this.description && this.chainInfo.value
  }

}

export default AppStateStore