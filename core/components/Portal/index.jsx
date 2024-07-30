import {createPortal} from 'react-dom';

export default function Portal({portalRef, children}) {
  if (!portalRef) {
    return null;
  }

  return createPortal(children, portalRef);
}
