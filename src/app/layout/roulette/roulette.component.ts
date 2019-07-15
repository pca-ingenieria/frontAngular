import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import swal, { SweetAlertType } from 'sweetalert2';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { interval } from 'rxjs';

export interface Swal {
    title?: string;
    text: string;
    type?: SweetAlertType;
    showCancelButton?: boolean;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    handlerConfirm?: any;
    handlerCancel?: any;
    allowOutsideClick?: boolean;
}

@Component({
    templateUrl: './roulette.component.html',
    styleUrls: ['./roulette.component.scss']
})
export class RouletteComponent implements OnInit {
    data: any;

    divOne = false;
    divTwo = false;
    divThree = false;
    timeNexSpinMinutes = 3;
    timeNexSpinSeconds: any = '00';
    interval;
    timeLeft = 0;
    colors = [
        {},
        {
            value: 'green'
        },
        {
            value: 'red'
        },
        {
            value: 'black'
        }
    ];

    constructor(private userService: UserService) {
           this.automaticInitial();
    }

    automaticInitial() {
        this.userService.getUsersAutomatic().subscribe(
            res => {
                this.data = res;
                this.spin();
            },
            error => {
                console.log('error', error);
            }
        );
    }

    onChange(color, index) {
        this.data[index].color = this.colors[color].value;
    }

    delay(flag) {
        switch (flag) {
            case 1:
                this.divOne = true;
                this.divTwo = false;
                this.divThree = false;
                break;
            case 2:
                this.divOne = false;
                this.divTwo = true;
                this.divThree = false;
                break;
            case 3:
                this.divOne = false;
                this.divTwo = false;
                this.divThree = true;
                break;
            default:
                this.divOne = false;
                this.divTwo = false;
                this.divThree = false;
                break;
        }
    }

    spin() {
        for (let index = 0; index < this.data.length; index++) {
            this.data[index].bet = Math.floor(Math.random() * (4 - 1)) + 1;
        }
        console.log(this.data);
        this.doAsyncTask().then(success => {
            console.log(success);
            this.executeBet(success);
        });
    }

    executeBet(bet) {
        this.userService.updateBet(this.data, bet).subscribe(
            res => {
                swal({
                    title: 'Exíto',
                    text: 'Se giro con exito la ruleta',
                    timer: 3000
                })
                    .then(willDelete => {
                        this.getData();
                    })
                    .catch(swal.noop);
            },
            error => {
                console.log('error', error);
            }
        );
        /*         for (let index = 0; index < this.data.length; index++) {
                    const element = this.data[index];
                    console.log(element);
                    if(this.data[index].bet == bet){
                        if(bet == 1){
                            this.data[index].amount = this.data[index].betAvailable * 20;
                        }else{
                            this.data[index].amount = this.data[index].betAvailable * 2;
                        }
                    }else{
                        this.data[index].amount -= this.data[index].betAvailable;
                    }

                } */
    }

    changeBet(flag, item, index) {
        const amount = this.data[index].amount;
        const betAvailable = this.data[index].betAvailable;
        switch (flag) {
            case 1:
                console.log(betAvailable, amount);
                this.data[index].flagMore = false;
                if (amount * 0.1 >= parseInt(betAvailable) - 1) {
                    this.data[index].flagLess = true;
                    this.data[index].betAvailable = amount * 0.1;
                } else {
                    this.data[index].betAvailable--;
                }

                /*
                       if ((amount * 0.1) <= (betAvailable + 1)) {
                           this.data[index].flagLess = true;
                           this.data[index].betAvailable = amount * 0.1;
                       }
                       this.data[index].betAvailable--; */
                break;
            case 2:
                this.data[index].flagLess = false;
                if (amount * 0.15 <= parseInt(betAvailable) + 1) {
                    this.data[index].flagMore = true;
                    this.data[index].betAvailable = amount * 0.15;
                } else {
                    this.data[index].betAvailable++;
                }
                /*     if ((amount * 0.15) <= (betAvailable + 1)) {
                        this.data[index].flagMore = true;
                        this.data[index].betAvailable = amount * 0.15;
                    } else {
                        this.data[index].betAvailable++;
                    } */
                break;
        }
    }

    doAsyncTask() {
        /*    this.timeout(10, 300).then(
               () => console.log("Task Complete!"),
               () => console.log("Task Errored!"),
           ); */
        const promise = new Promise((resolve, reject) => {
            let ciclo;
            const random = this.getRandomInt();
            if (random <= 49) {
                ciclo = 3;
            }
            if (random > 49 && random <= 98) {
                ciclo = 2;
            }
            if (random > 98) {
                ciclo = 1;
            }
            console.log(ciclo, random);

            this.delay(4);
            this.divOne = true;
            let count = 2;

            for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                    this.delay(count);
                    if (count >= 3) {
                        count = 1;
                    } else {
                        count++;
                    }
                }, i * 300);
            }

            setTimeout(() => {
                for (let i = 1; i <= 10; i++) {
                    setTimeout(() => {
                        this.delay(count);
                        if (count >= 3) {
                            count = 1;
                        } else {
                            count++;
                        }
                    }, i * 100);
                }
            }, 3000);

            setTimeout(() => {
                for (let i = 1; i <= ciclo + 6; i++) {
                    setTimeout(() => {
                        this.delay(count);
                        if (count >= 3) {
                            count = 1;
                        } else {
                            count++;
                        }
                    }, i * 300);
                }
            }, 4000);

            // OPCIONAL
            setTimeout(() => {
                resolve(ciclo);
            }, 7000);
        });
        return promise;
    }

    timeout(ciclos, time) {
        let count = 2;
        const promise = new Promise((resolve, reject) => {
            for (let i = 1; i <= ciclos; i++) {
                setTimeout(() => {
                    this.delay(count);
                    if (count >= 3) {
                        count = 1;
                    } else {
                        count++;
                    }
                }, i * time);
            }
            resolve();
        });
        return promise;
    }

    getRandomInt() {
        return Math.floor(Math.random() * (101 - 1)) + 1;
    }

    ngOnInit() {
        //  this.getData();
    }

    nextSpin() {
        /*    setTimeout(() => {

        }, 18000); */
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft <= 180) {
                if (this.timeNexSpinMinutes === 3) {
                    this.timeNexSpinSeconds = 59;
                    this.timeNexSpinMinutes = 2;
                }
                if (this.timeNexSpinSeconds === 0) {

                    if (this.timeNexSpinMinutes === 0) {
                        this.automaticInitial();
                        this.timeNexSpinSeconds = '00';
                        this.timeNexSpinMinutes = 3;
                        clearInterval(this.interval);
                    } else {
                    this.timeNexSpinSeconds = 59;
                    this.timeNexSpinMinutes--;
                    }
                } else {
                    this.timeNexSpinSeconds--;
                }
                this.timeLeft--;
            } else {
                this.timeLeft = 0;
            }
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.interval);
    }

    getData() {
        this.userService.getUsersAutomatic().subscribe(
            res => {
                this.data = res;
                this.startTimer();
            },
            error => {
                console.log('error', error);
            }
        );
    }
}
