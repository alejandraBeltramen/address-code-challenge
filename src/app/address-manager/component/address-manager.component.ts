import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressManagerService } from '../service/address-manager.service';
import { Address } from '../address-manager.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { AMOUNT_TABLE_PAGINE, SNACK_BAR_CONFIG, COLUMNS_TO_DISPLAY } from '../address-manager.constants';

@Component({
  selector: 'app-address-manager',
  templateUrl: './address-manager.component.html',
  styleUrls: ['./address-manager.component.scss']
})
export class AddressManagerComponent implements OnInit {
  addresses: Address[];
  tableDataSource: MatTableDataSource<Address>;
  tableColumns: string[] = COLUMNS_TO_DISPLAY;
  amountTablePagine: number[] = AMOUNT_TABLE_PAGINE;

  private snackBarHorizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private snackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private addressMngrService: AddressManagerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
  }

  onCellChange(event, element: Address, property: string): void {
    element[property] = event.target.value;
    event.srcElement.blur();

    this.saveAddresses();
  }

  private loadAddresses(): void {
    this.addressMngrService.getAddresses().subscribe(
      (addresses: Address[]) => {
        this.addresses = addresses;
        this.loadTable(addresses);
      },
      (error) => console.log('error')
    );
  }

  private loadTable(addresses: Address[]): void {
    this.tableDataSource = new MatTableDataSource(addresses);
    this.tableDataSource.sort = this.sort;
    this.tableDataSource.paginator = this.paginator;
  }

  private saveAddresses(): void {
    this.addressMngrService.updateAddresses(this.addresses).subscribe(
      (successMessage: string) => this.snackBar.open(
        successMessage,
        SNACK_BAR_CONFIG.message,
        {
          duration: SNACK_BAR_CONFIG.duration,
          horizontalPosition: this.snackBarHorizontalPosition,
          verticalPosition: this.snackBarVerticalPosition,
        }
      )
    );
  }
}
