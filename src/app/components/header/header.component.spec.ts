import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let compile: any;
  let router: any;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    compile = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create header', () => {
    const headerelm = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(headerelm).toBeTruthy();
  });

  it('should create header row', () => {
    const headerelmrow = fixture.debugElement.query(By.css('mat-toolbar-row'));
    expect(headerelmrow).toBeTruthy();
  });

  it('should click logo', () => {
    const el = fixture.debugElement.queryAll(By.css('#logo'))[0];
    expect(el.nativeElement.src).toEqual(
      'http://localhost:9876/assets/images/pokemon.png'
    );
    el.nativeElement.click();
    component.goHome();
    fixture.detectChanges();
    spyOn(router, 'navigate');
    expect(router.navigate).toHaveBeenCalled;
  });
});
