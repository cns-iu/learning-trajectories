import { QueryList, ElementRef } from '@angular/core';


export class EdgeAnimator {
  private state: 'stopped' | 'running' | 'paused' = 'stopped';
  private totalLength = -1;
  private currentAnimation: any;
  public duration: number;

  constructor(private elements: QueryList<ElementRef>) {
    elements.changes.subscribe(() => {
      stop();
    });
  }

  start(): void {
    switch (this.state) {
      case 'running':
        break;

      case 'paused':
        this.currentAnimation.play();
        break;

      case 'stopped':
        this.totalLength = 0;
        this.elements.forEach((e, index) => {
          const element = e.nativeElement as SVGPathElement;
          const length = element.getTotalLength();
          this.totalLength += length;
          this.setAttributes(element, length, length);
        });

        if (this.elements.length) {
          this.startElement(this.elements.first.nativeElement, 0);
        }

        break;
    }
    this.state = 'running';
  }

  pause(): void {
    if (this.state === 'running') {
      this.state = 'paused';
    }
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }
  }

  stop(): void {
    this.state = 'stopped';
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
      this.currentAnimation = undefined;
    }

    this.elements.forEach((e) => {
      this.removeAttributes(e.nativeElement);
    });
  }

  onAnimationEnd(index: number, event: any): any {
    const elements = this.elements.map((e) => e.nativeElement as Element);
    this.removeAttributes(elements[index]);

    if (index + 1 === elements.length) {
      this.state = 'stopped';
    } else {
      this.startElement(elements[index + 1] as SVGPathElement, index + 1);
    }
  }

  private setAttributes(
    element: Element, dasharray: number, dashoffset: number
  ): void {
    element.setAttribute('stroke-dasharray', String(dasharray));
    element.setAttribute('stroke-dashoffset', String(dashoffset));
  }

  private removeAttributes(element: Element): void {
    element.removeAttribute('animate');
    element.removeAttribute('stroke-dasharray');
    element.removeAttribute('stroke-dashoffset');
  }

  private startElement(element: SVGPathElement, index: number): void {
    const length = element.getTotalLength();
    const fraction = length / this.totalLength;
    const duration = 1000 * fraction * this.duration;
    const keyframes = [{
      strokeDashoffset: length
    }, {
      strokeDashoffset: 0
    }];

    this.currentAnimation = (element as any).animate(keyframes, duration);
    this.currentAnimation.onfinish = this.onAnimationEnd.bind(this, index);
  }
}
