import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { IProduct } from './models/product.interface';

const MOCK_PRODUCTS : IProduct[] = [
  { name: 'Hammer', price: 5},
  { name: 'Screwdriver', price: 12},
  { name: 'Pliers', price: 25},
  { name: 'Wrench', price: 7}
];

@Injectable()
export class ProductsService {
    constructor(){}

    /**
     * will return full list of mocked products
     * Delayed operation
     */
    public fetch():Observable<IProduct[]>{
      return Observable
        .of([...MOCK_PRODUCTS])
        .delay(Math.random() * 5000);
    }

    /**
     * will return mocked products, filtered by input phrase
     * Delayed operation
     */
    public search(phrase: string) : Observable<IProduct[]>{
      const filtered = MOCK_PRODUCTS
        .filter(p=>(new RegExp(phrase, 'ig')).test(p.name));

      return Observable
        .of(filtered)
        .delay(Math.random() * 5000);
    }

}