import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchVideos(query: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search`, { query });
  }

}
