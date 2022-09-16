import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CodeInputComponent } from 'angular-code-input';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-code-input-auth',
  templateUrl: './code-input-auth.component.html',
  styleUrls: ['./code-input-auth.component.scss']
})
export class CodeInputAuthComponent implements OnInit, OnChanges {
  @ViewChild('codeInput') codeInput!: CodeInputComponent;
  @Output() codeCompleted = new EventEmitter<any>();
  @Input() events!: Observable<void>;
  @Input() clearInput: boolean = false;
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
    } 
  }
  onCodeCompleted() {
    //this.codeCompleted.emit(code);
  }
  ngOnChanges() {
    if (this.clearInput) {
      this.codeInput.reset();
      //this.codeCompleted.emit('');
    }
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
