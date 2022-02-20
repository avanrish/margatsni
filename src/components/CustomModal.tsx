import Modal from 'react-responsive-modal';

export default function CustomModal({ children, open, onClose, medium = false, ...rest }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      classNames={{
        modal: `flex flex-col w-full rounded-lg !p-0 !text-center divide-y text-sm ${
          medium ? '!max-w-md' : '!max-w-xs'
        }`,
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
}
