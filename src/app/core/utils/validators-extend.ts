import { AbstractControl, ValidatorFn } from '@angular/forms';

function isEmptyInputValue(value: any) {
  return value == null || (typeof value === 'string' && value.length === 0);
}

function convertStringDateToDate(date: string) {
  const split = date.split('/');
  let day = 0;
  if (split[0]) {
    day = Number(split[0]);
  }
  let month = 0;
  if (split[1]) {
    month = Number(split[1]);
  }
  let year = 0;
  if (split[2]) {
    year = Number(split[2]);
  }
  if (year.toString().length === 4) {
    return new Date(year, month - 1, day, 0, 0, 0);
  } else {
    return null;
  }
}

function isValidDate(d: any) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    if (isNaN(d.getTime())) {
      // date is not valid
      return false;
    } else {
      // date is valid
      return true;
    }
  } else {
    // not a date
    return false;
  }
}

export class ValidatorsExtend {
  static getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any
  ): any {
    /**
     * Para las validaciones de cantidad máxima y cantidad minima de caracteres, tener en cuenta que
     * los variables que retornan como info deben ir en MINUSCULAS.
     */
    const config: any = {
      required: '* Campo obligatorio.',
      minlength: `La longitud mínima (${validatorValue.requiredLength} caracteres)`,
      maxlength: `Excede longitud máxima (${validatorValue.requiredLength} caracteres)`,
      requireobject: '* Debe seleccionar un item.',
      isMultiAlphanumeric: 'Campo solo admite letras y números.',
      isMultiAlphanumericLogin: ' ',
      isMultiAlphanumericLoginPassword: ' ',
      isMultiAlpha: 'Campo solo admite letras.',
      number: 'Campo admite números y/o símbolos válidos',
      isNumeric: 'Campo admite solo números',
      pattern: 'Campo admite solo letras, numeros y/o símbolos válidos',
      isMultiAlphanumericSimbol:
        'Campo admite solo letras, numeros y/o símbolos válidos',
      email: 'Formato de correo no es válido',
      isEmail: 'Formato de correo no es válido',
      hasWhitespace: 'No se permite espacios en blanco.',
      isPhoneNumber: 'El numero ingresado no es válido.',
      isURL: 'La URL de la página ingresada no es correcta.',
      isMultiAlphaWithExceptions:
        'Campo admite letras, nros. y punto(.) y coma(,) .',
      isMultiAlphaWithHyphen: 'Campo no válido.', // 'Campo no admite carácteres especiales, excepto guión(-).',
      isNumericWithExceptions: 'Campo admite nros., (), #, *, - y +',
      isDecimal: 'Campo solo admite números decimales',
      isOnlyNumberAndScript: 'El numero ingresado no es válido.',
      isRUC: 'El RUC ingresado no valido.',
      isInvalidDate: 'La fecha ingresada es inválida.',
      max: `Excede el valor maximo a ${validatorValue.max}`,
      min: `El valor minimo es de ${validatorValue.min}`,
      isInvalidDaTe: 'Formato de fecha incorrecto.',
    };
    return config[validatorName];
  }

  static todayAsMinDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (isEmptyInputValue(control.value)) {
        return null;
      }
      const start = convertStringDateToDate(control.value);
      if (!start) {
        return { isInvalidDate: true };
      }
      const startDate = new Date(start);
      if (!isValidDate(start)) {
        return { isInvalidDate: true };
      }
      const endDate = new Date();
      if (endDate.getTime() < startDate.getTime()) {
        return { isInvalidDate: true };
      }
      return null;
    };
  }
}
