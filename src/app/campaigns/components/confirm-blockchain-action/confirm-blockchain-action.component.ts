import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockchainActionsService } from '@core/services/blockchain-actions.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-blockchain-action',
  templateUrl: './confirm-blockchain-action.component.html',
  styleUrls: ['./confirm-blockchain-action.component.scss']
})
export class ConfirmBlockchainActionComponent implements OnInit {
  @Output() onSuccess = new EventEmitter();
  @Output() onFail = new EventEmitter();

  form = new FormGroup({
    password: new FormControl(null, Validators.required)
  });
  isLoading = false;
  errorMessage: string = '';
  actionResults$ = this.service.performAction();
  isDestroyed = new Subject();

  constructor(private service: BlockchainActionsService) {}

  ngOnInit(): void {
    this.actionResults$
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response) => {
        this.isLoading = false;
        // in case of success
        if (response.data && response.data.transactionHash) {
          this.service.setTrnxStatus({
            status: 'succeeded',
            transactionHash: response.data.transactionHash,
            message: 'success',
            action: response.action
          });
          this.onSuccess.emit(response.data.transactionHash);
        }

        // in case of error
        if (response.error) {
          if (response.error === 'Wrong password') {
            this.errorMessage = 'wrong_password';
          } else if (
            response.error ===
            'Rewards can be harvested only 24h after the last collect'
          ) {
            this.errorMessage =
              'Rewards can be harvested only 24h after the last collect';
          } else if (
            response.error ===
            'Returned error: insufficient funds for gas * price + value'
          ) {
            this.errorMessage = 'out_of_gas_error';
          } else {
            this.service.setTrnxStatus({
              status: 'failed',
              message: response.error
            });
            this.onFail.emit(response.error);
          }

          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  onFormSubmit() {
    this.isLoading = true;
    if (this.form.valid) {
      this.service.onConfirmButtonClick(this.password.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
