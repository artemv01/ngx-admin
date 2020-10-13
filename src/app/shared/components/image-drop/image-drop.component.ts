import {
  AfterViewInit,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-image-drop',
  templateUrl: './image-drop.component.html',
  styleUrls: ['./image-drop.component.scss'],
})
export class ImageDropComponent implements OnInit, AfterViewInit {
  @ViewChild('productImg') imageUploadEl: ElementRef;
  @Input('imageControl') imageControl: FormControl;
  //   @Input('initSrc$') initSrc$: Subject<string>;
  @Input('initSrc') initSrc: string;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.initSrc) {
      setTimeout(() => (this.isImageUploaded = true), 0);
    }
  }

  // product image
  dragBorder = false;
  isImageUploaded = false;
  imageTypeErr = false;

  // to prevent double-click
  imageLoading = false;

  onDragEnter(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.dragBorder = true;
  }

  onDragLeave(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.dragBorder = false;
  }

  onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.handleImageUpload({
      target: {
        files: e.dataTransfer.files,
      },
    });
  }
  handleImageUpload(event: any) {
    this.imageControl.disable();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.imageTypeErr = false;
      const allowed = ['image/jpeg', 'image/png'];
      if (!allowed.includes(file.type)) {
        this.imageTypeErr = true;
        this.imageControl.enable();
        this.imageLoading = false;
        return false;
      }

      const imageEl = this.imageUploadEl.nativeElement;
      imageEl.src = URL.createObjectURL(file);
      imageEl.onload = () => {
        URL.revokeObjectURL(imageEl.src);
        this.isImageUploaded = true;
        this.imageControl.enable();
        this.imageLoading = false;
      };
      this.imageControl.setValue(file, { emitModelToViewChange: false });
    }
  }
}
