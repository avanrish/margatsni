import Modal from 'react-responsive-modal';

export default function CustomModal({ children, open, onClose, ...rest }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
}
