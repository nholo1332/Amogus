import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsDisplayDialogComponent } from './rankings-display-dialog.component';

describe('RankingsDisplayDialogComponent', () => {
  let component: RankingsDisplayDialogComponent;
  let fixture: ComponentFixture<RankingsDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingsDisplayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
