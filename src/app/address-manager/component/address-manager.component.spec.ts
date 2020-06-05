import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressManagerComponent } from './address-manager.component';
import { AddressManagerService } from '../service/address-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Address } from '../address-manager.model';
import { MatTableDataSource } from '@angular/material/table';
import { SNACK_BAR_CONFIG } from '../address-manager.constants';


describe('AddressManagerComponent', () => {
  let component: AddressManagerComponent;
  let fixture: ComponentFixture<AddressManagerComponent>;
  const mockedAddresses: Address[] = [
    { streetNumber: 1, street: 'Jesse Hill Jr Street', city: 'Atlanta', state: 'TN', zip: 30309 },
    { streetNumber: 23, street: 'Peachtree Street', city: 'Brookhaven', state: 'NY', zip: 30301 },
    { streetNumber: 32, street: 'Jesse Hill Jr Street', city: 'Decatur', state: 'FL', zip: 30305 },
  ];
  let snackBarServiceMocked;
  let addressManagerServiceMocked;
  let addressMngrSpy;
  let snackBarSpy;

  beforeEach(async(() => {
    addressManagerServiceMocked = {
      getAddresses: () => of(mockedAddresses),
      updateAddresses: () => of({})
    };

    snackBarServiceMocked = {
      open: () => {}
    };

    TestBed.configureTestingModule({
      declarations: [ AddressManagerComponent ],
      providers: [
        { provide: AddressManagerService, useValue: addressManagerServiceMocked },
        { provide: MatSnackBar, useValue: snackBarServiceMocked }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    addressMngrSpy = TestBed.inject(AddressManagerService);
    snackBarSpy = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load addresses', () => {
      // Arrange
      component.addresses = [];
      spyOn(addressMngrSpy, 'getAddresses').and.returnValue(of(mockedAddresses));

      // Act
      component.ngOnInit();

      // Assert
      expect(addressMngrSpy.getAddresses).toHaveBeenCalledTimes(1);
      expect(component.addresses).toEqual(mockedAddresses);
    });

    it('should load table when addresses are retrieved', () => {
      // Arrange
      spyOn(addressMngrSpy, 'getAddresses').and.returnValue(of(mockedAddresses));

      // Act
      component.ngOnInit();

      // Assert
      expect(component.tableDataSource instanceof MatTableDataSource).toBeTruthy();
      expect(component.tableDataSource.data).toEqual(mockedAddresses);
    });
  });

  describe('On cell change', () => {
    it('should update model with the new value', () => {
      // Arrange
      const newValue = 'newValue';
      const mockedEvent = {
        target: { value: newValue },
        srcElement: { blur: () => {} }
      };
      const mockedElement: Address = mockedAddresses[1];
      const mockedProperty = 'city';
      component.addresses = mockedAddresses;
      spyOn(mockedEvent.srcElement, 'blur');

      // Act
      component.onCellChange(mockedEvent, mockedElement, mockedProperty);

      // Assert
      expect(component.addresses[1][mockedProperty]).toEqual(newValue);
      expect(mockedEvent.srcElement.blur).toHaveBeenCalledTimes(1);
    });

    it('should request to save the new value', () => {
      // Arrange
      const newValue = 'newValue';
      const mockedEvent = {
        target: { value: newValue },
        srcElement: { blur: () => {} }
      };
      const mockedElement: Address = mockedAddresses[1];
      const mockedProperty = 'city';
      component.addresses = mockedAddresses;
      spyOn(addressMngrSpy, 'updateAddresses').and.returnValue(of({}));

      // Act
      component.onCellChange(mockedEvent, mockedElement, mockedProperty);

      // Assert
      expect(addressMngrSpy.updateAddresses).toHaveBeenCalledTimes(1);
    });

    it('should display a notification indicating when the addresses were saved successfully', () => {
      // Arrange
      const newValue = 'newValue';
      const mockedEvent = {
        target: { value: newValue },
        srcElement: { blur: () => {} }
      };
      const mockedElement: Address = mockedAddresses[1];
      const mockedProperty = 'city';
      const expectedMessage = 'Random message';
      const expectedSnackBarOptions = {
        duration: SNACK_BAR_CONFIG.duration,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      };
      component.addresses = mockedAddresses;
      spyOn(addressMngrSpy, 'updateAddresses').and.returnValue(of(expectedMessage));
      spyOn(snackBarSpy, 'open');

      // Act
      component.onCellChange(mockedEvent, mockedElement, mockedProperty);

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledTimes(1);
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        expectedMessage,
        SNACK_BAR_CONFIG.message,
        expectedSnackBarOptions
      );
    });
  });
});
