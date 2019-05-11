import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SetPasswordComponent } from '../set-password/set-password.component';
import { SigninComponent } from '../signin/signin.component';


@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnInit {

    sub: Subscription = new Subscription();


    dialogRef: MatDialogRef<any>;
    dialog_sub: Subscription;
    constructor(private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router) {
        this.sub.add(route.params.pipe(
            tap((x) => {
                if (this.dialogRef) {
                    //The case when we are already showing a dialog and
                    //have been asked to show another one

                    if (this.dialog_sub) {
                        //We don't need to route to / anymore because we are
                        //going to open another dialog
                        this.dialog_sub.unsubscribe();
                    }
                    //but we still need to close the dialog that is already open
                    this.dialogRef.close();
                    //Now we need to wait for our close to finish and then
                    //start the next dialog 
                    this.dialogRef.afterClosed().pipe(
                        take(1),
                    ).subscribe(() => {
                        this.createModal(x);
                    });

                }
                else {
                    //The case when there wasn't already a dialog showing
                    this.createModal(x);
                }


            })
        ).subscribe());

    }

    createModal(modal) {
        console.log(modal);
        if (modal.component === 'login') {
            this.dialogRef = this.dialog.open(
                LoginComponent, { width: '400px' });
        } else if (modal.component === 'forgotpassword') {
            this.dialogRef = this.dialog.open(
                ForgotPasswordComponent, { width: '400px' });
        } else if (modal.component === 'signin') {
            this.dialogRef = this.dialog.open(
                SigninComponent, { width: '400px' });
        } else if (modal.component === 'setpassword') {
            this.dialogRef = this.dialog.open(
                SetPasswordComponent, { width: '400px' });
        }
        //wait to reset the router
        //this is what closes things down if you click off the dialog
        //we save the sub here so we can stop this action if you open
        //another dialog from within a dialog
        this.dialog_sub = this.dialogRef.afterClosed().pipe(
            take(1),
        ).subscribe(() => {
            this.router.navigateByUrl('/');
        });


    }
    ngOnInit() {

    }

    ngOnDestory() {
        this.sub.unsubscribe();
    }
}
