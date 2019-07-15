import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent, UserCreateComponent, UserEditComponent } from './user.component';

const routes: Routes = [
    {
        path: '',
        component: UserComponent
    },
    {
        path: 'create',
        component: UserCreateComponent
    },
    {
        path: 'edit/:id',
        component: UserEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
