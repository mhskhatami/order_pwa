import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IndexedDbService } from '../indexed-db/indexed-db.service';
import { MissionDetailDTO, MissionDTO } from '../../models/pages/MissionListDTO';
import { Mission } from '../../models/bazara/bazara-DTOs/Mission';
import { MissionDetail } from '../../models/bazara/bazara-DTOs/MissionDetail';
import { Person } from '../../models/bazara/bazara-DTOs/Person';
import { PersonAddress } from '../../models/bazara/bazara-DTOs/PersonAddress';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  filteredData: MissionDTO[] = [];
  selectedMission: BehaviorSubject<MissionDTO> = new BehaviorSubject<MissionDTO>({});

  constructor(private indexedDbService: IndexedDbService) { }

  getMissionList(): MissionDTO[] {
    this.filteredData = [];
    let data: MissionDTO = {
      TakingOrderCount: 0, DeliveryCount: 0, BardashtKalaCount: 0, VosoolMotalebatCount: 0
    };
    let detailData: MissionDetailDTO = {};

    Promise.all([
      this.indexedDbService.getAllData<Mission>('Mission'),
      this.indexedDbService.getAllData<MissionDetail>('MissionDetail')
    ]).then(([missions, missionDetails]) => {
      missions.forEach(mission => {
        if (!mission.Deleted) {
          data = {
            TakingOrderCount: 0, DeliveryCount: 0, BardashtKalaCount: 0, VosoolMotalebatCount: 0
          };

          data.MissionId = mission.MissionId;
          data.MainDescription = mission.Description!;
          data.MissionDate = mission.Date;
          data.MissionDone = mission.StatusAdmin ? missionDetails.length : 0;
          data.UnsuccessMissionCount = 0;
          data.SuccessMissionCount = 0;

          let relatedMissionDetails = missionDetails.filter(detail => detail.MissionId === mission.MissionId);
          data.MissionCount = relatedMissionDetails.length;
          data.MissionDetails = [];

          relatedMissionDetails.forEach(detail => {
            detailData = {};

            detailData.MissionDetailId = detail.MissionDetailId;
            detailData.Priority = detail.Priority;
            detailData.DetailDescription = detail.Description;
            detailData.Status = detail.Status;
            detailData.Type = detail.Type;
            detailData.PersonId = detail.PersonId;
            detailData.PersonAddressId = detail.PersonAddressId;

            data.MissionDetails?.push(detailData);

            if (detail.Type != null) {
              if (detail.Type === 1)
                data.TakingOrderCount = ++data.TakingOrderCount!;
              else if (detail.Type === 2)
                data.DeliveryCount = ++data.DeliveryCount!;
              else if (detail.Type === 3)
                data.VosoolMotalebatCount = ++data.VosoolMotalebatCount!;
              else if (detail.Type === 4)
                data.BardashtKalaCount = ++data.BardashtKalaCount!;
            }
          });
        }
        this.filteredData.push(data);
      });
    }).catch(error => {
      console.error('Error getting data from IndexedDB:', error);
    });

    return this.filteredData;
  }

  async findRelatedPerson(personId: number): Promise<Person> {
    let relatedPerson: Person = {
      Address: '', Balance: 0, City: '', CityCode: 0,
      CreateDate: '', CreateSyncId: 0, Credit: 0, DataHash: '',
      Deleted: false, Description: '', DiscountPercent: 0,
      EconomicNo: '', Email: '', Fax: '', FinanceTaxPayerType: '',
      FirstName: '', Gender: 0, LastName: '',
      Latitude: 0.0, Longitude: 0.0, Mobile: '', NationalCode: '',
      Organization: '', Password: '', PersonClientId: 0, PersonCode: 0,
      PersonGroupClientId: 0, PersonType: 0, Phone: '', PostalCode: '',
      PersonGroupCode: 0, PersonGroupId: 0, PersonId: 0, Prifix: '',
      RowVersion: 0, SellPriceLevel: 0, State: '', UpdateDate: '',
      UpdateSyncId: 0, UserName: '', Zone: ''
    };

    await this.indexedDbService.getById<Person>('Person', personId).then((res: Person) => {
      relatedPerson = res;
    });

    return new Promise((resolve, error) => {
      resolve(relatedPerson);
    });
  }

  async findRelatedPersonAddress(personAddressId: number): Promise<PersonAddress> {
    let relatedPersonAddress: PersonAddress = {
      Address: '', CreateDate: '', CreateSyncId: 0, DataHash: '',
      Deleted: false, Description: '', Latitude: 0.0, Longitude: 0.0,
      PersonClientId: 0, PersonCode: 0, CityId: 0, IsDefault: false,
      PersonId: 0, RowVersion: 0, UpdateDate: '', UpdateSyncId: 0,
      Mobile: 0, PersonAddressClientId: 0, PersonAddressCode: 0,
      PersonAddressId: 0, PostalCode: 0, Tel: 0, Title: ''
    };

    await this.indexedDbService.getById<PersonAddress>('PersonAddress', personAddressId).then((res: PersonAddress) => {
      relatedPersonAddress = res;
    });

    return new Promise((resolve, error) => {
      resolve(relatedPersonAddress);
    });
  }

  determineMissionStatus(mission: MissionDTO, detail: MissionDetailDTO, newStatus: number) {
    if (+newStatus === 1) {
      if (detail.Status == 3) {
        mission.MissionDone = mission.MissionDone! - 1;
        mission.SuccessMissionCount = mission.SuccessMissionCount! - 1;
      }
      else if (detail.Status == 4) {
        mission.MissionDone = mission.MissionDone! - 1;
        mission.UnsuccessMissionCount = mission.UnsuccessMissionCount! - 1
      }
    }
    else if (+newStatus === 2) {
      if (detail.Status == 3) {
        mission.MissionDone = mission.MissionDone! - 1;
        mission.SuccessMissionCount = mission.SuccessMissionCount! - 1;
      }
      else if (detail.Status == 4) {
        mission.MissionDone = mission.MissionDone! - 1;
        mission.UnsuccessMissionCount = mission.UnsuccessMissionCount! - 1;
      }
    }
    else if (+newStatus === 3) {
      if (detail.Status == 1 || detail.Status == 2) {
        mission.MissionDone = mission.MissionDone! + 1;
        mission.SuccessMissionCount = mission.SuccessMissionCount! + 1;
      }
      else if (detail.Status == 4) {
        mission.SuccessMissionCount = mission.SuccessMissionCount! + 1;
        mission.UnsuccessMissionCount = mission.UnsuccessMissionCount! - 1;
      }
    }
    else if (+newStatus === 4) {
      if (detail.Status == 1 || detail.Status == 2) {
        mission.MissionDone = mission.MissionDone! + 1;
        mission.UnsuccessMissionCount = mission.UnsuccessMissionCount! + 1;
      }
      else if (detail.Status == 3) {
        mission.SuccessMissionCount = mission.SuccessMissionCount! - 1;
        mission.UnsuccessMissionCount = mission.UnsuccessMissionCount! + 1;
      }
    }
    return mission;
  }
}