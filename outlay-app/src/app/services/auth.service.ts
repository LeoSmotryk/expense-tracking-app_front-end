import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient) {}

    register(userData: { email: string; password: string }) {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(userData: { email: string; password: string }) {
        return this.http.post(`${this.apiUrl}/login`, userData);
    }
}