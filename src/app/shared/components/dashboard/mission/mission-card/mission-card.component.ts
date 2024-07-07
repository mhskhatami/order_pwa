import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MissionDTO } from 'src/app/core/models/pages/MissionListDTO';
import { MissionService } from 'src/app/core/services/pages-services/mission.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrls: ['./mission-card.component.css']
})
export class MissionCardComponent {
  
  @Input() mission!: MissionDTO;

  constructor(private missionService: MissionService, private router: Router) { }

  onMissionDetailsClicked(selectedMission: MissionDTO) {
    this.missionService.selectedMission.next(selectedMission);
    this.router.navigate(['/mission-detail']);
  }
}