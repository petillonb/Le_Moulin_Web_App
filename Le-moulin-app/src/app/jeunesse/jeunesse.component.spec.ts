import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeunesseComponent } from './jeunesse.component';

describe('JeunesseComponent', () => {
  let component: JeunesseComponent;
  let fixture: ComponentFixture<JeunesseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JeunesseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeunesseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
