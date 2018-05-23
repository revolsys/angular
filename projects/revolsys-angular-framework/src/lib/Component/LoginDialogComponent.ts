import {
  Component,
  Inject,
  AfterViewInit
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {Config} from '../Config';

@Component({
  selector: 'raf-login-dialog',
  template: `
<h1 mat-dialog-title>Login</h1>
<div mat-dialog-content>
  <p>You must be logged in to access this application. Click the Login button to open the login window.</p>
  <p><b>NOTE:</b> Web browsers may block automated pop-up windows.<br />Allow popups for this site in your
web browser to open to allow the login popup.</p>
</div>
<div mat-dialog-actions>
  <button mat-raised-button (click)="login()" color="primary">Login</button>
</div>
  `,
})
export class LoginDialogComponent implements AfterViewInit {
  private loginWindow: Window;

  constructor(
    private config: Config,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngAfterViewInit() {
    this.login();
  }

  login() {
    const window = document.defaultView;
    if (this.loginWindow && !this.loginWindow.closed) {
      this.loginWindow.focus();
    } else {
      const top = window;
      let width = window.outerWidth * 0.9;
      if (width > 800) {
        width = 800;
      }
      const x = window.outerWidth / 2 + window.screenX - (width / 2);
      const y = window.outerHeight / 2 + window.screenY - (300);

      this.loginWindow = window.open(
        this.config.getUrl('/login/window'),
        'gwaLogin',
        `menubar=no,location=no,status=no,left=${x},top=${y},width=${width},height=600`
      );
    }
    if (this.loginWindow) {
      const listener = (event: any) => {
        if (event.data === 'close') {
          this.dialogRef.close('Login');
          if (this.loginWindow) {
            this.loginWindow.close();
            this.loginWindow = null;
          }
          window.removeEventListener('message', listener);
        }
      };
      window.addEventListener('message', listener);
    }
  }
}
