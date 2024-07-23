import { Component, OnInit } from '@angular/core';

import { MissionService } from 'src/app/core/services/pages-services/mission.service';
import { MissionDTO, MissionDetailDTO } from 'src/app/core/models/pages/MissionListDTO';
import { MatDialog } from '@angular/material/dialog';
import { MissionChangeStatusComponent } from '../mission-change-status/mission-change-status.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mission-detail',
  standalone: false,
  templateUrl: './mission-detail.component.html',
  styleUrl: './mission-detail.component.css'
})
export class MissionDetailComponent implements OnInit {

  selectedMission: BehaviorSubject<MissionDTO> = new BehaviorSubject<MissionDTO>({});
  selectedDetail!: MissionDetailDTO;
  columnSize: number = 4;

  constructor(private missionService: MissionService, private dialog: MatDialog, private router: Router) {
   setTimeout(() => {
     this.isObjEmpty(this.selectedMission.value);
     this.makeResponsive();    
   });
  }

  ngOnInit(): void {
    this.missionService.selectedMission.subscribe(res => {
      this.selectedMission.next(res);
    });

    this.getRelatedPerson(this.selectedMission.value);
    this.getRelatedPersonAddress(this.selectedMission.value);
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

  openDialog(missionDetail: MissionDetailDTO) {
    const dialogRef = this.dialog.open(MissionChangeStatusComponent, {
      data: { defaultStatus: missionDetail.Status }
    });

    dialogRef.afterClosed().subscribe(newStatus => {
      if (newStatus !== undefined) {
        this.selectedMission.next(this.missionService.determineMissionStatus(this.selectedMission.value, missionDetail, newStatus));

        this.missionService.saveMissionData(this.selectedMission.value);
        this.missionService.saveMissionDetailData(missionDetail, newStatus);

        missionDetail.Status = newStatus;
      }
    });
  }

  setDetailStatus(status: number): string {
    if (+status === 1)
      return 'شروع نشده';
    else if (+status === 2)
      return 'در مسیر';
    else if (+status === 3) {
      return 'موفق';
    }

    return 'ناموفق';
  }

  makeResponsive() {
    let monitorWidth = window.innerWidth;

    if (monitorWidth < 425)
      this.columnSize = 1;

    if (monitorWidth < 728)
      this.columnSize = 2;
  }

  isObjEmpty(obj: MissionDTO) {
    if (Object.keys(obj).length === 0)
      this.router.navigate(['/dashboard']);
  }
}