import { Component, OnInit } from '@angular/core';

import { MissionService } from 'src/app/core/services/pages-services/mission.service';
import { MissionDTO } from 'src/app/core/models/pages/MissionListDTO';
import { MatDialog } from '@angular/material/dialog';
import { MissionChangeStatusComponent } from '../mission-change-status/mission-change-status.component';

@Component({
  selector: 'app-mission-detail',
  standalone: false,
  templateUrl: './mission-detail.component.html',
  styleUrl: './mission-detail.component.css'
})
export class MissionDetailComponent implements OnInit {

  selectedMission!: MissionDTO;

  constructor(private missionService: MissionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.missionService.selectedMission.subscribe(res => {
      this.selectedMission = res;
    })

    this.getRelatedPerson(this.selectedMission);
    this.getRelatedPersonAddress(this.selectedMission);
  }

  getRelatedPerson(selectedMission: MissionDTO) {
    selectedMission.MissionDetails?.forEach(ele => {
      this.missionService.findRelatedPerson(ele.PersonId!).then(res => {
        ele.PersonId = res.PersonId;
        ele.PersonName = res.FirstName + ' ' + res.LastName;
      });
    });
  }

  getRelatedPersonAddress(selectedMission: MissionDTO) {
    selectedMission.MissionDetails?.forEach(ele => {
      this.missionService.findRelatedPersonAddress(ele.PersonAddressId!).then(res => {
        ele.PersonAddressId = res.PersonAddressId;
        ele.Title = res.Title;
      });
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(MissionChangeStatusComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result, 'mission detail');
        // if (+result === 1)
        //   this.missionStatus = 'شروع نشده';
        // else if (+result === 2)
        //   this.missionStatus = 'در مسیر';
        // else if (+result === 3)
        //   this.missionStatus = 'موفق';
        // else if (+result === 4)
        //   this.missionStatus = 'ناموفق';
      }
    });
  }
}