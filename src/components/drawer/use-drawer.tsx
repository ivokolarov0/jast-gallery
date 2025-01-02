import { useState } from 'react'

const useDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(old => !old);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  return {isOpen, setIsOpen, toggleOpen, handleOpen, handleClose}
}

export default useDrawer