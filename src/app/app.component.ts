import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from './ui-core/loading/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  isSpinnerVisible = true;
  spinnerSubscription: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.spinnerSubscription = this.loadingService.visibility.subscribe((newValue) => this.isSpinnerVisible = newValue);
  }

  ngOnDestroy(): void {
    this.spinnerSubscription.unsubscribe();
  }
}
