import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IndexedDbService } from '../indexed-db/indexed-db.service';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { PersonAddress } from '../../models/bazara/bazara-DTOs/PersonAddress';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  peopleList: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]);

  constructor(private indexedDbService: IndexedDbService) {
    this.getPeopleList();
  }

  getPeopleList() {
    this.indexedDbService.getAllData<Person>("Person").then((people: Person[]) => {
      this.peopleList.next(people);
    });
  }

  getRelatedPersonAddresses(personId: number) {
    this.indexedDbService.getByIndex<PersonAddress>("PersonAddress","by-personId",+personId).then((personAdderress) => {
      console.log(personAdderress);

    })
  }
}
