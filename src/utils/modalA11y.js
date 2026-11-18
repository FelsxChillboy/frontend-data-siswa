const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const createModalKeydownHandler = ({ onClose, disabled = false }) =>
  (event) => {
    if (event.key === 'Escape') {
      if (disabled) return;
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const fields = Array.from(
      event.currentTarget?.querySelectorAll?.(FOCUSABLE_SELECTOR) ?? [],
    );
    if (fields.length === 0) return;

    const first = fields[0];
    const last = fields[fields.length - 1];

    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first.focus();
    }
  };
