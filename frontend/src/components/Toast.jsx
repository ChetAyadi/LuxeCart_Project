import React, { useContext } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useContext(CartContext);

  if (!toastMessage) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-4"
      style={{ zIndex: 1100 }}
    >
      <div className="toast show align-items-center text-white bg-dark border-warning shadow-lg rounded-3">
        <div className="d-flex p-3 align-items-center gap-3">
          <CheckCircle2 className="text-warning flex-shrink-0" size={22} />
          <div className="toast-body p-0 fw-medium">
            {toastMessage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
