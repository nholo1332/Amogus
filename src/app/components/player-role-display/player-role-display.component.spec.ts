import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRoleDisplayComponent } from './player-role-display.component';

describe('PlayerRoleDisplayComponent', () => {
  let component: PlayerRoleDisplayComponent;
  let fixture: ComponentFixture<PlayerRoleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerRoleDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerRoleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
