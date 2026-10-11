import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Aceita vazio; recusa datas ('YYYY-MM-DD') posteriores a hoje. */
export const pastDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.getTime() > today.getTime() ? { futureDate: true } : null;
};