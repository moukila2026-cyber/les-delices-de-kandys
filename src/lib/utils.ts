export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
