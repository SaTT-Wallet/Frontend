import {
  AbstractControl,
  ValidatorFn,
  UntypedFormControl,
  UntypedFormArray,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import Big from 'big.js';
import moment from 'moment';
import { ListTokens } from '@config/atn.config';
import { WalletFacadeService } from '@core/facades/wallet-facade.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export function checkIfEnoughBalance(
  walletFacade: WalletFacadeService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const initialBudget = control.get('initialBudget') as UntypedFormControl;
    const currency = control.get('currency') as UntypedFormControl;
    return walletFacade.cryptoList$.pipe(
      take(1),
      map((res) => {
        const selectedCrypto = res.find((elem: any) => {
          return elem.symbol === currency.value;
        });
        if (!isNaN(initialBudget.value) && currency.value && selectedCrypto) {
          const amount = new Big(initialBudget.value || 0);
          const balance = selectedCrypto
            ? new Big(selectedCrypto.quantity)
            : '0';
          return amount.gt(balance) ? { notEnoughBalance: true } : null;
        }
        return null;
      })
    );
  };
}
export function MatchPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password?.value &&
      confirmPassword?.value &&
      password.value !== confirmPassword.value
      ? { mustMatch: true }
      : null;
  };
}

/**---------Creation campaign Validation (remuneration + budget) -------------- */

// check if InitiaBudget is required
export function InitiaBudgetValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  let initialBudget = control.get('initialBudget')?.value;
  if (0 >= initialBudget) {
    return {
      invalidBudget: true
    };
  }
  return {};
}
// check if form array is required
export function customValidateRequired(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let ratios = (control.get('ratios') as UntypedFormArray).controls;
    let bounties = (control.get('bounties') as UntypedFormArray).controls;
    if (ratios.length === 0 && bounties.length === 0) {
      return {
        remunRequired: true
      };
    }
    return null;
  };
}
// check if InsufficientBudget > sum of price
export function customValidateInsufficientBudget(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let ratios = (control.get('ratios') as UntypedFormArray).controls;
    let bounties = (control.get('bounties') as UntypedFormArray).controls;
    let initialBudget = control.get('initialBudget')?.value;
    let sum = 0;
    let sumReward = 0;
    let totale = 0;
    let totaleBounties = 0;
    if (ratios.length) {
      ratios.forEach((elem: any) => {
        sum =
          Number(elem.value.view) +
          Number(elem.value.like) +
          Number(elem.value.share);
        if (!isNaN(sum)) {
          totale += sum;
        }
      });
    }

    if (bounties.length) {
      bounties.forEach((elem: any) => {
        elem.value.categories.forEach((val: any) => {
          sumReward = Number(val.reward);
          if (!isNaN(sumReward)) {
            totaleBounties += sumReward;
          }
        });
      });
    }

    if (initialBudget > 0) {
      if (
        (totale && totale > initialBudget) ||
        (totaleBounties && totaleBounties > initialBudget)
      ) {
        return {
          InsufficientBudget: true
        };
      }
    }

    return null;
  };
}
// check if all fileds are required and if minFollowers > maxFollowers (remunerate with public)
export function customValidateBounties(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let maxFollowers: any;
    let minFollowers: any;
    let reward: any;
    maxFollowers = Number(control.get('maxFollowers')?.value);
    minFollowers = Number(control.get('minFollowers')?.value);
    reward = Number(control.get('reward')?.value);

    if (
      !isNaN(minFollowers) &&
      !isNaN(maxFollowers) &&
      (minFollowers > maxFollowers || minFollowers === maxFollowers)
    ) {
      return {
        minBountiesGrater: true
      };
    }
    if (maxFollowers === 0 || minFollowers === 0 || reward === 0) {
      return {
        bountiesFiledRequired: true
      };
    }

    return null;
  };
}
// check if at least one field is null (remunerate with performance)
export function customValidateRatios(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let view: any;
    let like: any;
    let share: any;
    let somme = 0;
    view = Number(control.get('view')?.value);
    like = Number(control.get('like')?.value);
    share = Number(control.get('share')?.value);
    somme = view + like + share;
    if (!isNaN(like) && !isNaN(view) && !isNaN(share) && somme <= 0) {
      return {
        invalidRatioSomme: true
      };
    }
    return null;
  };
}
//check if Min subscribers of the following category greater than the max subscribers of the previous category
export function customValidateMaxMin(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let categories = control.value;
    for (let i = 0; i < categories.length; i++) {
      if (categories.length > 1) {
        if (categories[i + 1]?.minFollowers !== null) {
          if (
            Number(categories[i]?.maxFollowers) >
              Number(categories[i + 1]?.minFollowers) ||
            Number(categories[i]?.maxFollowers) ===
              Number(categories[i + 1]?.minFollowers)
          ) {
            return {
              invalidCategoryMaxMin: true
            };
          }
        }
      }
    }
    return null;
  };
}
export function transformFromWei(
  value: string,
  symbol: string,
  digits: number = 3
): string {
  if (!value || value === '0') return '0';

  let decimals = ListTokens[symbol].decimals.toString();
  if (value === 'SATTBEP20') {
    value = 'SATT';
  }
  return new Big(value).div(decimals).round(digits).toString();
}
/**---------------------------------------------------------------------- */
export function atLastOneChecked(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let checkBoxes = control.value;
    let checked = 0;
    let minRequired = 1;

    Object.values(checkBoxes).forEach((element: any) => {
      if (element !== null) {
        checked++;
      }
    });
    if (checked < minRequired) {
      return {
        requireCheckboxes: true
      };
    }
    return null;
  };
}

export function requiredDescription(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let checkBoxes = control.value;
    let requiredElseReason!: boolean;
    if (
      checkBoxes['reason4'] !== null &&
      (checkBoxes['description'] === null || checkBoxes['description'] === '')
    ) {
      requiredElseReason = true;
    } else {
      requiredElseReason = false;
    }
    if (requiredElseReason === true) {
      return {
        requiredElseReason: true
      };
    }
    return null;
  };
}
/**---------------------------------------------------------------------- */
export function underEighteen(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let dob = control.value;
    const today = moment().startOf('day');
    const delta = today.diff(dob.birthday, 'years', false);

    if (delta <= 18) {
      return {
        underEighteen: true
      };
    }

    return null;
  };
}
export function arrayLength(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let subMissionArrayLength = control.value.length;
    if (subMissionArrayLength === 6) {
      return {
        maxMission: true
      };
    }
    return null;
  };
}
export class WhiteSpaceValidator {
  static noWhiteSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string)?.indexOf(' ') >= 0) {
      return { noWhiteSpace: true };
    }
    return null;
  }
}
