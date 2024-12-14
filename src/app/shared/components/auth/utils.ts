import { AbstractControl } from "@angular/forms";

export function PasswordValidator(control: AbstractControl) {
    if (!control.value) return null

    const errors: any = {}
    if (control.value.length < 8) {
        errors.minLength = { requiredLength: 8, actualLength: control.value.length }
    }
    if (control.value.length > 20) {
        errors.maxLength = { requiredLength: 20, actualLength: control.value.length }
    }
    // one number, one lowercase and one uppercase letter and special character
    if (!/[a-z]/.test(control.value)) {
        errors.lowercase = true
    }
    if (!/[A-Z]/.test(control.value)) {
        errors.uppercase = true
    }
    if (!/[0-9]/.test(control.value)) {
        errors.number = true
    }
    if (!/[^a-zA-Z0-9]/.test(control.value)) {
        errors.special = true
    }
    return Object.keys(errors).length ? errors : null

}

export function MatchPasswordValidator(control: AbstractControl) {
    if (!control.get('password') || !control.get('passwordConfirmation')) return null

    return control.get('password')!.value === control.get('passwordConfirmation')!.value ? null : { passwordMismatch: true }

}