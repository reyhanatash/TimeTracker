import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[OnlyText]'
})
export class OnlyText {

  constructor(private el: ElementRef) {
  }

  @Input() OnlyText: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if (this.OnlyText) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) ||
        (e.keyCode > 64 && e.keyCode < 86) ||
        (e.keyCode >= 87 && e.keyCode < 91) ||
        (e.keyCode > 96 && e.keyCode < 123) ||
        (e.keyCode == 32)) {
        // let it happen, don't do anything
        return;
      }
      else if ((e.keyCode == 86 && e.ctrlKey === true)) {
        return false;
      } else if (e.keyCode == 86) {
        return;
      }

      // Ensure that it is a number and stop the keypress
      if ((e.keyCode > 48 || e.keyCode < 57) && (e.keyCode > 96 || e.keyCode < 105)) {
        e.preventDefault();
        // return false;
      }

    }
  }
}
