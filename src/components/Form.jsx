import { useEffect, useId, useRef, useState } from 'react';

/** Text input with a label. tone="light" = grey pills (in-app); tone="dark" = translucent pills on the red sheet. */
export function Field({ label, tone = 'light', className = '', ...inputProps }) {
  const id = useId();
  return (
    <div className={`field field--${tone} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
    </div>
  );
}

/** Native <select> styled as a pill. */
export function PillSelect({ label, tone = 'light', value, onChange, options, placeholder = 'Select' }) {
  const id = useId();
  return (
    <div className={`field field--${tone}`}>
      <label htmlFor={id}>{label}</label>
      <div className="pill-select">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

/** Pill that opens a checklist. Empty selection reads "Select All". */
export function PillMultiSelect({ label, tone = 'light', value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const allSelected = value.length === options.length;
  const summary = value.length === 0 ? 'Select All' : allSelected ? 'All selected' : value.join(', ');
  const toggle = (opt) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className={`field field--${tone}`} ref={ref}>
      <span id={id} className="field__label">{label}</span>
      <button
        type="button"
        className="pill-select pill-select--button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id}
        onClick={() => setOpen((o) => !o)}
      >
        {summary}
      </button>
      {open && (
        <ul className="multi-list" role="listbox" aria-multiselectable="true" aria-labelledby={id}>
          <li>
            <label>
              <input type="checkbox" checked={allSelected} onChange={() => onChange(allSelected ? [] : [...options])} />
              Select all
            </label>
          </li>
          {options.map((opt) => (
            <li key={opt}>
              <label>
                <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
