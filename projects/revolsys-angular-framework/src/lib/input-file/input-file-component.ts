import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';

@Component({
  'selector': 'raf-input-file',
  'template': `
<input [accept]="accept" type="file" (change)="onNativeInputFileSelect($event)" #inputFile hidden />

<mat-form-field>
  <input matInput placeholder="File" name="file" [(ngModel)]="fileName" disabled="true" />
</mat-form-field>
 
<button type="button" mat-raised-button (click)="selectFile()">
  <mat-icon fontSet="fa" fontIcon="fa-{{iconName}}"></mat-icon>
  {{label}}
</button>
`
})
export class InputFileComponent {
  @Input() accept: string;

  @Input() iconName = 'floppy-o';

  @Input() label = 'Choose File';

  @Output() onFileSelect: EventEmitter<File> = new EventEmitter();

  @ViewChild('inputFile') nativeInputFile: ElementRef;

  private file: File;

  fileName: string;

  onNativeInputFileSelect(event) {
    const files = event.srcElement.files;
    if (files.length === 0) {
      this.file = null;
      this.fileName = null;
    } else {
      this.file = files[0];
      this.fileName = this.file.name;
    }
    this.onFileSelect.emit(this.file);
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }

}
