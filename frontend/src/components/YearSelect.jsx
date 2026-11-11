import { useEffect, useId, useRef, useState } from 'react';
import './YearSelect.css';

/**
 * YearSelect — dropdown buatan sendiri pengganti <select> bawaan browser.
 * Dipakai agar tampil konsisten dan tetap bisa dibuka di browser pratinjau editor.
 *
 * Props:
 *   id        id tombol (opsional)
 *   label     teks untuk pembaca layar, mis. "Tahun kejadian"
 *   value     nilai terpilih (string)
 *   options   [{ value: 'all', label: 'Semua tahun' }, ...]
 *   onChange  (value: string) => void
 *   className kelas tambahan pada wadah
 */
export default function YearSelect({ id, label, value, options, onChange, className = '' }) {
  const autoId = useId();
  const baseId = id || `dd-${autoId}`;
  const listId = `${baseId}-list`;
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => String(option.value) === String(value)),
  );
  const [active, setActive] = useState(selectedIndex);
  const selected = options[selectedIndex];

  // Tutup saat klik di luar
  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [open]);

  // Jaga opsi aktif tetap terlihat saat navigasi keyboard
  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.children[active];
    if (node?.scrollIntoView) node.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    const option = options[index];
    setOpen(false);
    if (option && String(option.value) !== String(value)) onChange(String(option.value));
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openMenu();
        else setActive((index) => Math.min(options.length - 1, index + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openMenu();
        else setActive((index) => Math.max(0, index - 1));
        break;
      case 'Home':
        if (open) { event.preventDefault(); setActive(0); }
        break;
      case 'End':
        if (open) { event.preventDefault(); setActive(options.length - 1); }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(active);
        else openMenu();
        break;
      case 'Escape':
        if (open) { event.preventDefault(); setOpen(false); }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div ref={rootRef} className={`gs-dd${open ? ' is-open' : ''} ${className}`.trim()}>
      <button
        id={baseId}
        type="button"
        className="gs-dd__btn"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="gs-dd__value">{selected ? selected.label : ''}</span>
        <i className="bi bi-chevron-down gs-dd__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul id={listId} ref={listRef} className="gs-dd__menu" role="listbox" aria-label={label}>
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`gs-dd__option${index === active ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}`}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {isSelected && <i className="bi bi-check2" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}