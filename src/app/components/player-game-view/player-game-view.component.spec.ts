import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGameViewComponent } from './player-game-view.component';

describe('PlayerGameViewComponent', () => {
  let component: PlayerGameViewComponent;
  let fixture: ComponentFixture<PlayerGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerGameViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
