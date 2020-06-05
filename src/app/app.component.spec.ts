import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of, BehaviorSubject } from 'rxjs';
import { LoadingService } from './ui-core/loading/loading.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingServiceMock;
  let loadingServiceSpy;

  beforeEach(async(() => {
    loadingServiceMock = {
      show: () => of(true),
      hide: () => of(false),
      visibility: new BehaviorSubject(true)
    };

    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      providers: [{
        provide: LoadingService, useValue: loadingServiceMock
      }]});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loadingServiceSpy = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });
  });
});
