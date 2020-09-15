import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Todo } from '../model/todo';


const httpOptions = {//
  headers: new HttpHeaders({
    'Content-Type':'applications/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  Url:string = 'https://jsonplaceholder.typicode.com/todos/';
  Limit = '?_limit=10';

  constructor(private http:HttpClient) { }

  getCustomers():Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.Url}${this.Limit}`);
  }
}
