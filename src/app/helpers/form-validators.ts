import {
  AbstractControl,
  ValidatorFn,
  FormControl,
  FormArray
} from '@angular/forms';
import Big from 'big.js';
import { WalletStoreService } from '@core/services/wallet-store.service';
import moment from 'moment';

export function checkIfEnoughBalance(service: WalletStoreService): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const initialBudget = control.get('initialBudget') as FormControl;
    const currency = control.get('currency') as FormControl;
    const selectedCrypto = service.walletBalance.find((elem: any) => {
      return elem.symbol === currency.value;
    });

    if (!isNaN(initialBudget.value) && currency.value && selectedCrypto) {
      const amount = new Big(initialBudget.value || 0);
      const balance = selectedCrypto ? new Big(selectedCrypto.quantity) : '0';

      return amount.gt(balance) ? { notEnoughBalance: true } : null;
    }
    return null;
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
    let ratios = (control.get('ratios') as FormArray).controls;
    let bounties = (control.get('bounties') as FormArray).controls;
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
    let ratios = (control.get('ratios') as FormArray).controls;
    let bounties = (control.get('bounties') as FormArray).controls;
    let initialBudget = control.get('initialBudget')?.value;
    let sum = 0;
    //let sumReward = 0;
    let totale = 0;
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
      let resultVal;

      bounties.forEach((elem: any) => {
        elem.value.categories.forEach((val: any) => {
          if (+val.reward > initialBudget) {
            resultVal = false;
          }
        });
      });
      if (resultVal === false) {
        return {
          InsufficientBudget: true
        };
      }
    }

    if (initialBudget > 0) {
      if (totale && totale > initialBudget) {
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
