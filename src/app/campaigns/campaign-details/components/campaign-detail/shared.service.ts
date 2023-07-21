import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public campaignTopBarRef!: ElementRef<HTMLElement>;

  constructor() { }
}