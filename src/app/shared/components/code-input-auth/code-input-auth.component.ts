import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CodeInputComponent } from 'angular-code-input';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-code-input-auth',
  templateUrl: './code-input-auth.component.html',
  styleUrls: ['./code-input-auth.component.scss']
})
export class CodeInputAuthComponent implements OnInit {
  @ViewChild('codeInput') codeInput!: CodeInputComponent;
  @Output() codeCompleted = new EventEmitter<any>();
  @Input() events!: Observable<void>;
  private eventsSubscription!: Subscription;

  private isDestroyed = new Subject();

  constructor() {}

  ngOnInit(): void {
    if (this.events) {
      this.eventsSubscription = this.events
        .pipe(takeUntil(this.isDestroyed))
        .subscribe(() => {
          this.codeInput.reset();
        });
    }
  }
  onCodeChanged(event: string) {
    let codeNum = event;
    if (codeNum.length === 6) {
      this.codeCompleted.emit(codeNum);
    } else {
      this.codeCompleted.emit('');
    }
  }
  onCodeCompleted(code: string) {
    //this.codeCompleted.emit(code);
  }
  ngAfterviewInit() {}
  ngOnDestroy() {
    if (this.events) {
      this.eventsSubscription.unsubscribe();
    }
    this.isDestroyed.next('');
    this.isDestroyed.unsubscribe();
  }
}
