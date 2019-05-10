import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';


@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent implements OnInit {

    sub: Subscription = new Subscription();


    dialogRef;

    constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
        this.sub.add(route.params.pipe(
            tap((x) => {
                console.log(x);
                if (x.component === 'login') {
                    this.dialogRef = this.dialog.open(
                        LoginComponent, { width: '400px' });
                }
            })
        ).subscribe());

        this.dialogRef.afterClosed().subscribe(() => {
            router.navigateByUrl('/');
        });
    }

    ngOnInit() {

    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
