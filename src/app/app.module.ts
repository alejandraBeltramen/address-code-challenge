import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AddressManagerComponent } from './address-manager/component/address-manager.component';
import { MaterialDesignModule } from './angular-material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddressManagerService } from './address-manager/service/address-manager.service';
import { CustomHttpInterceptor } from './interceptor/http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AddressManagerComponent
  ],
  imports: [
    BrowserModule,
    MaterialDesignModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    AddressManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
