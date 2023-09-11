import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { ControlService, ControlInput, Result, VertifyQuery } from './control';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@app/core/services/Auth/auth.service';
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-xfu-slide-control',
  templateUrl: './slide-control.component.html',
  styleUrls: ['./slide-control.component.css']
})
export class SlideControlComponent implements OnInit, OnDestroy {
  @Input()
  controlInput!: ControlInput;
  @Output() successMatch: EventEmitter<VertifyQuery> = new EventEmitter();
  @ViewChild(SlideControlComponent, { static: true })
  slide: SlideControlComponent | undefined;
  @Output() onValueChanged = new EventEmitter<boolean>();

  private query: VertifyQuery | undefined;

  private slider: any;
  private puzzleBefore: any;
  private sliderContainer: any;
  private sliderMask: any;
  private sliderText: any;
  private puzzleBox: any;
  private puzzleBase: any;
  private puzzleMask: any;

  isMouseDown = false;
  private trail: number[] = [];
  private originX: any;
  private originY: any;
  private w: any = 310; // basePuzzle's width
  private h: any = 155; // basePuzzle's height
  private l: any = 62; // puzzle's width

  private pngBase64 = 'data:image/png;base64,';
  private jpgBase64 = 'data:image/jpeg;base64,';

  result!: Result | undefined; // api's Result
  originalImage: any;
  puzzle: any;
  id: any;
  position: any;
  private isDestroyed = new Subject();

  // api's Result
  private onDestoy$ = new Subject();
  constructor(
    private el: ElementRef,
    private controlService: ControlService,
    private translate: TranslateService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    this.getImagepuzzle();
    if (isPlatformBrowser(this.platformId)) {
      this.slider = this.el.nativeElement.querySelector('.slider');
      this.puzzleBefore = this.el.nativeElement.querySelector('.puzzleBefore');
      this.sliderContainer =
        this.el.nativeElement.querySelector('.sliderContainer');
      this.sliderMask = this.el.nativeElement.querySelector('.sliderMask');
      this.sliderText = this.el.nativeElement.querySelector('.sliderText');
      this.puzzleBox = this.el.nativeElement.querySelector('.puzzleBox');
      this.puzzleBase = this.el.nativeElement.querySelector('.puzzleBase');
      this.puzzleMask = this.el.nativeElement.querySelector('.puzzleMask');
      this.draw();
      this.puzzleBox.style.display = 'block';
      this.resetWindow();

      window.onresize = () => {
        this.resetWindow();
      };
    }
  }
  getImagepuzzle() {
    this.authService
      .imagespuzzle()
      .pipe(takeUntil(this.isDestroyed))
      .subscribe((response: any) => {
        this.originalImage = response.data.originalImage;
        this.puzzle = response.data.puzzle;
        this.id = response.data._id;
      });
  }
  resetWindow() {
    this.puzzleBox.style.left = this.sliderContainer.offsetLeft + 1 + 'px';
  }

  touchStart(e: any) {
    this.originX = e.clientX || e.touches[0].clientX;
    this.originY = e.clientY || e.touches[0].clientY;
    this.isMouseDown = true;
    this.puzzleBox.style.display = 'block';
    this.puzzleMask.style.display = 'block';
  }

  touchMove(e: any) {
    // var shiftKeyPressed = e.shiftKey;
    // console.log(this.isMouseDown);
    if (!this.isMouseDown) {
      return false;
    }

    const eventX = e.clientX || e.touches[0].clientX;
    const eventY = e.clientY || e.touches[0].clientY;

    const moveX = eventX - this.originX;
    const moveY = eventY - this.originY;
    if (moveX < 0 || moveX + 38 >= this.w) {
      return false;
    }
    this.slider.style.left = moveX + 'px';
    const blockLeft = ((this.w - this.l) / (this.w - 40)) * moveX;
    this.puzzleBefore.style.left = blockLeft + 'px';
    this.sliderContainer.classList.add('sliderContainer_active');
    this.sliderMask.style.width = moveX + 'px';
    this.trail.push(moveY);
    return false;
  }

  touchEnd(e: any) {
    if (!this.isMouseDown) {
      return false;
    }
    this.isMouseDown = false;
    this.sliderContainer.classList.remove('sliderContainer_active');
    this.puzzleMask.style.display = 'none';
    const eventX = e.clientX || e.changedTouches[0].clientX;
    if (eventX === this.originX) {
      return false;
    }
    const query: VertifyQuery = {
      move: parseInt(this.puzzleBefore.style.left),
      action: undefined
    };

    const _id = this.id;
    const position = query.move;
    const send: any = { _id, position };
    //this.onValueChanged.emit(send);
    this.authService
      .verifyimagespuzzle(send)
      .pipe(
        filter((res) => res !== null),
        takeUntil(this.onDestoy$),

        map((response: any) => response.message),
        catchError(() => {
          this.onValueChanged.emit(false);
          this.translate.get('puzzle-verification-fail');
          return this.translate.get('puzzle-verification-fail');
        }),
        mergeMap((message) => {
          if (message === 'success') {
            this.onValueChanged.emit(send);
            query.action = this.trail;
            this.successMatch.emit(query);
            this.sliderContainer.classList.add('sliderContainer_success');
            this.puzzleBox.style.display = 'none';
            return of(true);
          } else if (message === 'Try again') {
            this.sliderContainer.classList.add('sliderContainer_fail');
            this.sliderText.innerHTML = message;
            setTimeout(() => {
              this.reset();
            }, 1000);
          }
          return of(true);
        })
      )
      .pipe(
        filter((res) => res !== true),

        takeUntil(this.isDestroyed)
      )
      .subscribe((message) => {
        this.sliderContainer.classList.add('sliderContainer_fail');
        this.sliderText.innerHTML = message;
        setTimeout(() => {
          this.reset();
        }, 1000);
      });
    return false;
  }

  reset() {
    this.slider.style.left = 0;
    this.puzzleBefore.style.left = 0;
    this.sliderMask.style.width = 0;
    this.sliderContainer.className = 'sliderContainer';
    this.trail = [];
    this.getImagepuzzle();
    // console.log("rest")
  }

  draw() {
    this.controlService
      .getAuthImage(this.controlInput?.genUrl)
      .pipe(takeUntil(this.isDestroyed))
      .subscribe(
        (data: Result) => {
          this.result = { ...data };
          if (this.result.success) {
            this.puzzleBase.querySelector('img').src =
              this.jpgBase64 + this.result.data.bigImage;
            this.puzzleBefore.querySelector('img').src =
              this.pngBase64 + this.result.data.smallImage;
            this.puzzleBefore.style.top = this.result.data.yheight + 'px';
          } else {
          }
        },
        () => {}
      );
  }
  ngOnDestroy() {
    this.onDestoy$.next('');
    this.onDestoy$.complete();
  }
}
