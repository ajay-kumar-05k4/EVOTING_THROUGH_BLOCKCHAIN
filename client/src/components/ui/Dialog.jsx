import PropTypes from 'prop-types';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
};

export const DialogContent = ({ children }) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 Dialog-bg" />
      <DialogPrimitive.Content className="fixed inset-1/4 max-h-64 bg-[#09090b] rounded-lg border border-gray-700 border-solid p-[40px] top-[35%] shadow-lg">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

export const DialogFooter = ({ children }) => {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-bold mb-2">{children}</h2>;
};

Dialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
};

DialogFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

