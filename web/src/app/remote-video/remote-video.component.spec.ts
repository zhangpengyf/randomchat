import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteVideoComponent } from './remote-video.component';

describe('RemoteVideoComponent', () => {
  let component: RemoteVideoComponent;
  let fixture: ComponentFixture<RemoteVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
