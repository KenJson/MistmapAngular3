import { TestBed } from '@angular/core/testing';
import { CameraAvatar } from './cameraavatar.component';

describe('CameraAvatar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraAvatar],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CameraAvatar);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'capacitorDemo' title`, () => {
    const fixture = TestBed.createComponent(CameraAvatar);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('capacitorDemo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CameraAvatar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, capacitorDemo');
  });
});
