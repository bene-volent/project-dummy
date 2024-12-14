import { AuthFormComponent } from './auth-form/auth-form.component';
import { AuthFormActionsComponent } from './auth-form-actions/auth-form-actions.component';
import { AuthFormButtonComponent } from './auth-form-buttons/auth-form-buttons.component';
import { AuthFormFieldComponent } from './auth-form-field/auth-form-field.component';
import { AuthFormHeaderComponent } from './auth-form-header/auth-form-header.component';
import { NgModule } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@NgModule({
    declarations: [
        AuthFormComponent,
        AuthFormActionsComponent,
        AuthFormButtonComponent,
        AuthFormFieldComponent,
        AuthFormHeaderComponent
    ],
    imports: [
        ReactiveFormsModule,
        RouterLink,
    ],
    exports: [
        AuthFormComponent,
        AuthFormActionsComponent,
        AuthFormButtonComponent,
        AuthFormFieldComponent,
        AuthFormHeaderComponent
    ]
})
export class AuthFormModule {}