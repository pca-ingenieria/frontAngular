import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    closeResult: string;
    total = 0;
    totalProductos: any = 0;
    notification() {
        if (localStorage.getItem("notification")) {
            return localStorage.getItem("notification")
        } else {
            return 0;
        }
    }

    constructor(public router: Router, private modalService: NgbModal) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    cancel() {
        this.modalService.dismissAll();
    }

    buy(content) {
        let arrProducts = JSON.parse(localStorage.getItem("productBuy"));
        arrProducts.forEach(element => {
            this.total = this.total + parseInt(element.price);
        });
        this.totalProductos = arrProducts.length;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
         
        }, (reason) => {
            console.log("reason", reason)
        });
    }
}
