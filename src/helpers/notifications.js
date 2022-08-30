const errorToast = {
  position: 'top',
  status: 'error',
  duration: 4000,
  isClosable: true
}

export const showErrorToast = (toast, id, title, description) => {
  const newToast = {
    id,
    title: title, 
    description: description,
    ...errorToast
  }

  if (!toast.isActive(id))
    toast(newToast)
}


