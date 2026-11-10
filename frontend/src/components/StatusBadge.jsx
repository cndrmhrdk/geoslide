import { STATUS_PENCARIAN } from '../utils/orangHilang';

const ICON = {
  searching: 'bi-search',
  found: 'bi-check-circle',
  closed: 'bi-lock',
};

/**
 * StatusBadge — penanda status pencarian orang hilang.
 * Status dibedakan lewat ikon + teks (bukan warna saja).
 * Gaya (.oh-status) ada di pages/InformasiOrangHilang.css.
 */
export default function StatusBadge({ status }) {
  return (
    <span className={`oh-status oh-status--${status}`}>
      <i className={`bi ${ICON[status] ?? 'bi-dot'}`} aria-hidden="true"></i>
      {STATUS_PENCARIAN[status] ?? status}
    </span>
  );
}
