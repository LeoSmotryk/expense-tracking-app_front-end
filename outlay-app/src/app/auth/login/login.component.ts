import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    constructor(private authService: AuthService) {}

    onSubmit() {
        this.authService.login({ email: this.email, password: this.password }).subscribe(
            (response) => {
                console.log('Login successful', response);
            },
            (error) => {
                console.error('Login failed', error);
            }
        );
    }
}