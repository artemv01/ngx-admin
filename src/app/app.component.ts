import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, NgModel, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /* @ViewChild('tagsInput') tagsInput: FormControl;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];
  filterTags$: Observable<any[]>;
  tags: any[] = [
    {
      name: 'books',
      id: '1',
    },
    {
      name: 'networks',
      id: '2',
    },
    {
      name: 'motherboards',
      id: '3',
    },
  ];
  usedTags: any[] = [
    {
      name: 'books',
      id: '1',
    },
  ];

  constructor(private fb: FormBuilder) {}
  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    onSale: [false],
    salePrice: [''],
  });

  ngAfterViewInit() {
    setTimeout(
      () =>
        (this.filterTags$ = this.tagsInput.valueChanges.pipe(
          startWith(''),
          map((val) => (val ? this._filter(val) : this.tags))
        )),
      0
    );
  }

  private _filter(search: string): any[] {
    return this.tags.filter(
      (tagItem) =>
        tagItem.name.toLowerCase().indexOf(search.toLowerCase()) === 0
    );
  }

  add({ input, value }): void {
    // Add our fruit
    if ((value || '').trim()) {
      this.usedTags.push({ name: value });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selected({ option: { value: tag } }) {
    // this.usedTags.push({ name: opt.name, id: opt.id });
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  } */
}
