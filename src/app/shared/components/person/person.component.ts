import { Component, HostListener, OnInit } from '@angular/core';
import { Person } from 'src/app/core/models/bazara/bazara-DTOs/Person';
import { UtilityService } from 'src/app/core/services/common/utility.service';
import { PersonService } from 'src/app/core/services/pages-services/person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent implements OnInit {

  breakpoint: number = 1;
  peopleList: Person[] = [];
  isLoading: boolean = false;
  manualHeight!: number;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.measureHeightWidth();
  }

  measureHeightWidth() {
    //height
    this.manualHeight = window.innerHeight - 128;

    //width
    this.breakpoint = this.utilityService.makeGridResponsive(320);
  }

  constructor(private personService: PersonService, private utilityService: UtilityService) {
    this.measureHeightWidth();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getPeopleList();
  }

  getPeopleList() {
    this.personService.peopleList.subscribe(res => {
      this.peopleList = res;
    });
    this.isLoading = false;
  }
}