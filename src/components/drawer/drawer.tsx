import classNames from "classnames";
import { useEffect } from "react";

type PropTypes = {
  children: React.ReactNode;
  open: boolean;
  handleClose: () => void;
}

const Drawer = ({ children, open, handleClose }: PropTypes) => {
  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress);
    return () => document.removeEventListener('keydown', handleEscapePress);
  }, [open])

  return (
    <div className={classNames("drawer", { "is-open": open })}>
      <div className="drawer__overlay" onClick={handleClose}></div>
      <div className="drawer__inner">
        <button className="drawer__close" onClick={handleClose}>
          <span></span>
          <span></span>
        </button>
        {children}
      </div>
    </div>
  )
}

export default Drawer