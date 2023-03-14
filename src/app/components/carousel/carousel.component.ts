import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  @ViewChild('slider') sliderEl: ElementRef;
  @ViewChild('sliderWrap') sliderListEl: ElementRef;
  count: number = 1;
  slider: any;
  sliderList: any;
  sliderWidth: number;
  items: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.slider = this.sliderEl.nativeElement;
    this.sliderList = this.sliderListEl.nativeElement;
    this.sliderWidth = this.slider.offsetWidth;
    this.items = this.sliderList.querySelectorAll('li').length;

    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  prevSlide() {
    if (this.count > 1) {
      this.count = this.count - 2;
      this.sliderList.style.left = '-' + this.count * this.sliderWidth + 'px';
      this.count++;
    } else if ((this.count = 1)) {
      this.count = this.items - 1;
      this.sliderList.style.left = '-' + this.count * this.sliderWidth + 'px';
      this.count++;
    }
  }

  nextSlide() {
    if (this.count < this.items) {
      this.sliderList.style.left = '-' + this.count * this.sliderWidth + 'px';
      this.count++;
    } else if ((this.count = this.items)) {
      this.sliderList.style.left = '0px';
      this.count = 1;
    }
  }
}
