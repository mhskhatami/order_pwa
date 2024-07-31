import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.css'
})
export class PersonCardComponent {
  @Input() person!: Person;

  constructor(private router: Router) { }

  selectPerson(person: Person) {
    this.router.navigate(['/invoice']);
  }

  getRelatedPersonAddress(person: Person) {
    this.router.navigate(['/people-list', person.PersonId]);
  }
}