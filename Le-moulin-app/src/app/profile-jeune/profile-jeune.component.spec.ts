import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileJeuneComponent } from './profile-jeune.component';

describe('ProfileJeuneComponent', () => {
  let component: ProfileJeuneComponent;
  let fixture: ComponentFixture<ProfileJeuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileJeuneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileJeuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
