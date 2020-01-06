import { format } from 'date-fns';

export const formatDate = (date?: Date | number) =>
  date ? format(+date, 'd MMM yyy') : '';

export const debounce = (func: any, wait: any, immediate?: any) => {
  let timeout: any;

  return function(...args: any) {
    //@ts-ignore
    let context = this;

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (immediate && !timeout) {
      func.apply(context, args);
    }
  };
};

export function applyDiscount(discount: number = 0, price?: number) {
  if (!price) return '';
  return `${(price * ((100 - discount) / 100)).toFixed(2)} €`;
}
