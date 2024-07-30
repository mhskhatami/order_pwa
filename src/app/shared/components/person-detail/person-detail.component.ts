import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PeopleListDTO } from 'src/app/core/models/pages/People_Addresses';
import { MapComponent } from '../map/map.component';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from 'src/app/core/services/pages-services/person.service';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent implements OnInit {

  selectedItem!: PeopleListDTO;

  //   constructor(private bottomSheetRef: MatBottomSheetRef<MapComponent>,
  //     @Inject(MAT_BOTTOM_SHEET_DATA) public personSelected: any, private route: ActivatedRoute) { }
  // // 
  constructor(private route: ActivatedRoute, private personService: PersonService) { }

  ngOnInit(): void {
    // console.log(this.personSelected);
    this.getPersonDetailInfo();
  }

  getPersonDetailInfo() {
    let a = this.route.snapshot.params['personId'];
    console.log(a);
    this.personService.getRelatedPersonAddresses(a);

  }
}
