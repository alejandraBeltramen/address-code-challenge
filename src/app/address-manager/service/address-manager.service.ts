import { Injectable } from '@angular/core';
import { ADDRESS_URL } from '../address-manager.constants';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address } from '../address-manager.model';
import {
  ADDRESS_REGULAR_EXPRESSION,
  ISOLATE_LINES_REGULAR_EXPRESSION,
  STREET_NUMBER_INDEX,
  STREET_NAME_INDEX,
  CITY_INDEX,
  STATE_INDEX,
  ZIP_INDEX
} from '../address-manager.utils';

@Injectable({
  providedIn: 'root'
})
export class AddressManagerService {

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]> {
    return this.http.get(ADDRESS_URL, { responseType: 'text' })
      .pipe(
        map(rawData => this.parseAddresses(rawData))
      );
  }

  updateAddresses(addresses: Address[]): Observable<{}> {
    /**
     * Should request to POST url sending the updated
     * addresses.
     * Note: the addresses could need being parsed
     * before sending them.
     */

    // return this.http.post(ADDRESS_URL, addresses);

    // simulation
    return of('Saved successfully!');
  }

  /**
   * It parses plain text into an array of Address objects
   * @param rawData plain text that contains all the addresses
   */
  private parseAddresses(rawData: string): Address[] {
    const allLines: string[] = rawData.split(ISOLATE_LINES_REGULAR_EXPRESSION);
    const addresses: Address[] = [];
    let splitedAddress: string[];
    let partialAddress: Address;

    allLines.pop();
    allLines.forEach(line => {
      splitedAddress = ADDRESS_REGULAR_EXPRESSION.exec(line);

      partialAddress = {
        streetNumber: +splitedAddress[STREET_NUMBER_INDEX],
        street: splitedAddress[STREET_NAME_INDEX],
        city: splitedAddress[CITY_INDEX],
        zip: +splitedAddress[ZIP_INDEX],
        state: splitedAddress[STATE_INDEX]
      };

      addresses.push(partialAddress);
    });

    return addresses;
  }
}
