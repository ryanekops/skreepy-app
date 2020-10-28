import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookReadPage } from './book-read.page';

describe('BookReadPage', () => {
  let component: BookReadPage;
  let fixture: ComponentFixture<BookReadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookReadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookReadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
