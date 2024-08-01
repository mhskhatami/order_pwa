import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAccountDetailComponent } from './transfer-account-detail.component';

describe('TransferAccountDetailComponent', () => {
  let component: TransferAccountDetailComponent;
  let fixture: ComponentFixture<TransferAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferAccountDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
