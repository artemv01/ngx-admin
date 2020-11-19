import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Optional, Self } from '@angular/core';
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
  implements OnInit, OnDestroy, MatFormFieldControl<number> {
  @HostBinding() id = `rating-input-${RateItemComponent.nextId++}`;

  starWidth = 24;
  ratingState = Array(5).fill('star_outline');

  private rating: number = 0;

  private onChange: Function;
  private onTouched: Function;

  static nextId = 0;
  placeholder = '';
  focused = false;
  shouldLabelFloat = true;
  stateChanges = new Subject<void>();
  get empty() {
    return !this.rating;
  }

  errorState = false;
  controlType = 'rating-input';

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get value() {
    return this.rating;
  }
  set value(rating: number) {
    this.rating = rating;
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.onChange = (_: any) => {};
    this.onTouched = () => {};
    this.disabled = false;
  }
  isTouchScreen() {
    return 'ontouchstart' in document.documentElement;
  }

  ngOnInit(): void {}

  hoverRate(starIndex: number, lastStar: string) {
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

  rate(newRating: number = this.rating) {
    this.rating = newRating;
    this.buildStars();
    this.stateChanges.next();
    /*   this.onChange(this.rating);
    this.onTouched(); */
  }

  writeValue(rating: number): void {
    if (rating === null) {
      rating = 0;
    }
    this.rating = rating;

    this.buildStars();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  buildStars() {
    if (this.rating < 1) {
      if (this.rating === 0.5) {
        this.ratingState[0] = 'star_half';
        this.ratingState.fill('star_outline', 1);
        return;
      } else if (this.rating === 0) {
        this.ratingState.fill('star_outline', 0);
      } else {
        return;
      }
    }

    let newRating = this.rating - 1;
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

  ngOnDestroy() {
    this.stateChanges.complete();
  }
}
