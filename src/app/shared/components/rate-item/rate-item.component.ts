import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ElementRef, HostListener, Optional, Self } from '@angular/core';
import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  Input,
  HostBinding,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

const RATE_ITEM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RateItemComponent),
  multi: true,
};

@Component({
  selector: 'app-rate-item',
  templateUrl: './rate-item.component.html',
  styleUrls: ['./rate-item.component.scss'],
  providers: [
    // RATE_ITEM_VALUE_ACCESSOR,
    { provide: MatFormFieldControl, useExisting: RateItemComponent },
  ],
})
export class RateItemComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<number> {
  @HostBinding() id = `rating-input-${RateItemComponent.nextId++}`;
  @HostListener('mouseleave')
  restoreRating() {
    if (!this.isTouchScreen()) {
      this.rate();
    }
  }

  starWidth = 24;
  ratingState = Array(5).fill('star_outline');

  private onChange: Function;
  private onTouched: Function;
  private _value: number = 0;
  private _required: boolean = false;
  private _disabled: boolean = false;

  static nextId = 0;
  focused = false;
  shouldLabelFloat = true;
  stateChanges = new Subject<void>();
  get empty() {
    return !this.value;
  }

  errorState = false;
  controlType = 'rating-input';

  public placeholder = '';

  @Input('aria-describedby') userAriaDescribedBy: string;
  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
  }

  @Input()
  get value() {
    return this._value;
  }
  set value(rating: number) {
    this._value = rating;
    this.stateChanges.next();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private _elementRef: ElementRef
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.onChange = (_: any) => {};
    this.onTouched = () => {};
    this.disabled = false;
  }

  ngOnInit(): void {}

  hoverRate(starIndex: number, lastStar: string) {
    if (this.isTouchScreen()) return;
    this.ratingState = this.ratingState.map((_, index) => {
      if (index < starIndex) {
        return 'star';
      } else if (index > starIndex) {
        return 'star_outline';
      } else {
        return lastStar;
      }
    });
  }

  rate(newRating: number = this.value) {
    this.value = newRating;
    this.buildStars();

    console.log('from comp', this.value);
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(rating: number): void {
    if (rating === null) {
      rating = 0;
    }
    this.value = rating;

    this.buildStars();
  }

  buildStars() {
    if (this.value < 1) {
      if (this.value === 0.5) {
        this.ratingState[0] = 'star_half';
        this.ratingState.fill('star_outline', 1);
        return;
      } else if (this.value === 0) {
        this.ratingState.fill('star_outline', 0);
      } else {
        return;
      }
    }

    let newRating = this.value - 1;
    let truncated = Math.trunc(newRating);
    let lastIndex = 0;

    this.ratingState = this.ratingState.map((_, index) => {
      if (index <= truncated) {
        lastIndex = index;
        return 'star';
      } else if (index > truncated) {
        return 'star_outline';
      }
    });
    if (lastIndex < 4) {
      lastIndex++;
      if (newRating - truncated >= 0.5) {
        this.ratingState[lastIndex] = 'star_half';
      }
    }
  }
  onContainerClick(event: MouseEvent) {}

  private isTouchScreen() {
    return 'ontouchstart' in document.documentElement;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }
}
