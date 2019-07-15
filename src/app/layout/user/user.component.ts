import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import swal, { SweetAlertType } from 'sweetalert2';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';

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
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    data: any;
    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getUsers().subscribe(
            res => {
                this.data = res;
            },
            error => {
                console.log('error', error);
            }
        );
    }

    deleteUser(id) {
        swal({
            title: 'Advertencia',
            text: 'Deseas eliminar el usuario?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.value) {
                this.userService.deleteUser(id).subscribe(res => {
                    swal({
                        title: 'Exíto',
                        text: 'Se elinino el usuario exisotamente'
                    })
                        .then(willDelete => {
                            this.ngOnInit();
                        })
                        .catch(swal.noop);
                });
            }
        }).catch(swal.noop);
    }
}

@Component({
    templateUrl: './user.create.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserCreateComponent implements OnInit {
    constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
        this.userForm = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required])),
            lastName: new FormControl('', Validators.compose([Validators.required])),
            amount: new FormControl('12000', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
            telephone: new FormControl('', Validators.compose([Validators.required]))
        });
    }
    userForm: any;

    formErrors = {
        name: [],
        lastName: [],
        amount: [],
        email: [],
        telephone: []
    };

    validationMessages = {
        name: {
            required: 'El nombre es obligatorio.'
        },
        lastName: {
            required: 'El apellido es obligatorio.'
        },
        amount: {
            required: 'La cédula es obligatoria.'
        },
        email: {
            required: 'El correo es obligatorio.',
            email: 'El formato del correo eléctronico no es valido'
        },
        telephone: {
            required: 'El teléfono es obligatorio.'
        }
    };

    listarMensajes(msj: Array<any>) {
        let listMensajes = '';
        msj.forEach(function(value) {
            listMensajes = listMensajes + '<li>' + value + '</li>';
        });
        listMensajes = '<ul>' + listMensajes + '</ul>';
        return listMensajes;
    }

    ngOnInit() {}

    onSubmit() {
        const errorValidacion = [];
        const form = this.userForm;

        // tslint:disable-next-line:forin
        for (const field in this.formErrors) {
            this.formErrors[field] = [];
            this.userForm[field] = '';
            const control = form.get(field);
            if (control && !control.valid) {
                const messages = this.validationMessages[field];

                // tslint:disable-next-line:forin
                for (const key in control.errors) {
                    errorValidacion.push(messages[key]);
                }
            }
        }
        if (this.userForm.valid) {
            this.userService.saveUser(this.userForm.value).subscribe(
                res => {
                    swal({
                        title: 'Exíto',
                        text: 'Se creo el usuario exisotamente'
                    })
                        .then(willDelete => {
                            this.router.navigate(['/user']);
                        })
                        .catch(swal.noop);
                },
                error => {
                    swal({
                        title: 'Error',
                        text: error.error.mensaje,
                        type: 'warning'
                    }).catch(swal.noop);
                }
            );
        } else {
            swal({
                title: 'Error',
                html: this.listarMensajes(errorValidacion),
                type: 'warning'
            }).catch(swal.noop);
        }
    }
}

@Component({
    templateUrl: './user.edit.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserEditComponent implements OnInit {
    id;
    // tslint:disable-next-line:member-ordering
    userForm: any;
    formErrors = {
        name: [],
        lastName: [],
        amount: [],
        email: [],
        telephone: []
    };

    validationMessages = {
        name: {
            required: 'El nombre es obligatorio.'
        },
        lastName: {
            required: 'El apellido es obligatorio.'
        },
        amount: {
            required: 'La cédula es obligatoria.'
        },
        email: {
            required: 'El correo es obligatorio.',
            email: 'El formato del correo eléctronico no es valido'
        },
        telephone: {
            required: 'El teléfono es obligatorio.'
        }
    };

    constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
        this.userForm = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required])),
            lastName: new FormControl('', Validators.compose([Validators.required])),
            amount: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
            telephone: new FormControl('', Validators.compose([Validators.required]))
        });
        this.getData();
    }

    getData() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.userService.showUser(this.id).subscribe(
            res => {
                this.userForm.controls['name'].setValue(res.name);
                this.userForm.controls['amount'].setValue(res.amount);
                this.userForm.controls['telephone'].setValue(res.telephone);
                this.userForm.controls['lastName'].setValue(res.lastName);
                this.userForm.controls['email'].setValue(res.email);
            },
            error => {
                console.log('error', error);
            }
        );
    }

    ngOnInit() {}

    onSubmit() {
        const errorValidacion = [];
        const form = this.userForm;

        // tslint:disable-next-line:forin
        for (const field in this.formErrors) {
            this.formErrors[field] = [];
            this.userForm[field] = '';
            const control = form.get(field);
            if (control && !control.valid) {
                const messages = this.validationMessages[field];

                // tslint:disable-next-line:forin
                for (const key in control.errors) {
                    errorValidacion.push(messages[key]);
                }
            }
        }
        if (this.userForm.valid) {
            this.userService.editUser(this.userForm.value, this.id).subscribe(
                res => {
                    swal({
                        title: 'Exíto',
                        text: 'Se edito el usuario exisotamente'
                    })
                        .then(willDelete => {
                            this.router.navigate(['/user']);
                        })
                        .catch(swal.noop);
                },
                error => {
                    swal({
                        title: 'Error',
                        text: error.error.mensaje,
                        type: 'warning'
                    }).catch(swal.noop);
                }
            );
        } else {
            swal({
                title: 'Error',
                html: this.listarMensajes(errorValidacion),
                type: 'warning'
            }).catch(swal.noop);
        }
    }

    listarMensajes(msj: Array<any>) {
        let listMensajes = '';
        msj.forEach(function(value) {
            listMensajes = listMensajes + '<li>' + value + '</li>';
        });
        listMensajes = '<ul>' + listMensajes + '</ul>';
        return listMensajes;
    }
}
