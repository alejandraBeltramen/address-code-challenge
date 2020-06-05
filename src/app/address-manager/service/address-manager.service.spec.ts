import { TestBed } from '@angular/core/testing';

import { AddressManagerService } from './address-manager.service';
import { Observable, of } from 'rxjs';
import { ADDRESS_URL } from '../address-manager.constants';
import { HttpClient } from '@angular/common/http';
import { Address } from '../address-manager.model';

const mockedText = `1 Jesse Hill Jr Street, Atlanta, TN 30309
9007199254740992 Hank Aaron Drive, Decatur, GA 30317
12357 Glen Iris Drive NE, Sandy Sprints, FL 30327
`;

describe('AddressManagerService', () => {
  let service: AddressManagerService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'put']);

    TestBed.configureTestingModule({
      providers: [
        AddressManagerService,
        { provide: HttpClient, useValue: spy }
      ]
    });
    service = TestBed.inject(AddressManagerService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Get addresses', () => {
    it('should request addresses and return an observable', () => {
      // Arrange
      const expectedRoute = ADDRESS_URL;
      httpClientSpy.get.and.returnValue(of({}));

      // Act
      const result = service.getAddresses();

      // Assert
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedRoute, jasmine.any(Object));
      expect(result instanceof Observable).toBeTruthy();
    });

    it('should parse text plain into an array of Address objects', () => {
      // Arrange
      httpClientSpy.get.and.returnValue(of(mockedText));
      const expectedStreetNumber = 9007199254740992;
      const expectedStreetName = 'Jesse Hill Jr Street';
      const expectedCity = ' Sandy Sprints';
      const expectedState = ' GA';
      const expectedZip = 30309;

      // Act
      let result;
      service.getAddresses().subscribe(
        (response: Address[]) => result = response
      );

      // Assert
      expect(result[1].streetNumber).toEqual(expectedStreetNumber);
      expect(result[0].street).toEqual(expectedStreetName);
      expect(result[2].city).toEqual(expectedCity);
      expect(result[1].state).toEqual(expectedState);
      expect(result[0].zip).toEqual(expectedZip);
      expect(result.length).toEqual(3);
    });
  });

  describe('Update addresses', () => {
    it('should post updated addresses and return an observable', () => {
      // Arrange

      // Act
      const result = service.updateAddresses([]);

      // Assert
      expect(result instanceof Observable).toBeTruthy();
      // When POST gets implemented...
      // expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
