import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent, UserCreateComponent, UserEditComponent } from './user.component';
import { UserService } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        UserRoutingModule
    ],
    providers:[
        UserService
    ],
    declarations: [
        UserComponent,
        UserCreateComponent,
        UserEditComponent
    ]
})
export class UserModule { }
