import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauProfileJeuneComponent } from './nouveau-profile-jeune.component';

describe('NouveauProfileJeuneComponent', () => {
  let component: NouveauProfileJeuneComponent;
  let fixture: ComponentFixture<NouveauProfileJeuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouveauProfileJeuneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauProfileJeuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
