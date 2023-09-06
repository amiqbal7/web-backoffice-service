export function currencyFormatIDR(number: number | bigint) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}
