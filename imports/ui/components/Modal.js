import React, { PropTypes } from 'react';

// eslint-disable-next-line react/prop-types
const Modal = ({ title, children, onConfirm, onCancel, confirmText, cancelText }) => {
  const renderFooter = () => {
    if (onConfirm) {
      return undefined;
    }

    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={onConfirm}>{confirmText}</button>
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onCancel}>{cancelText}</button>
      </div>
    );
  };

  return (
    <div id="modal" className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,

  // eslint-disable-next-line react/require-default-props
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  confirmText: 'Ok',
  cancelText: 'Cancel',
};

export default Modal;
