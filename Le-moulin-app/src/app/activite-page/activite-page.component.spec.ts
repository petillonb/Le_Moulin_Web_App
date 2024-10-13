import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitePageComponent } from './activite-page.component';

describe('ActivitePageComponent', () => {
  let component: ActivitePageComponent;
  let fixture: ComponentFixture<ActivitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
