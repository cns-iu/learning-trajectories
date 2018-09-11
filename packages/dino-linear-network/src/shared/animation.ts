import { QueryList, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';


export type AnimationEvent = 'start' | 'stop' | 'pause';

export class EdgeAnimator {
  private elements: SVGPathElement[] = [];
  private state: 'stopped' | 'running' | 'paused' = 'stopped';
  private totalLength = -1;
  private currentAnimation: any;
  private forward = true;
  public duration: number;
  readonly events = new Subject<AnimationEvent>();

  constructor(elementList: QueryList<ElementRef>) {
    this.updateInitial(elementList);
    elementList.changes.subscribe(() => {
      stop();
      this.updateElements(elementList);
    });
  }

  start(): void {
    switch (this.state) {
      case 'running':
        break;

      case 'paused':
        this.state = 'running';
        this.forward = true;
        this.currentAnimation.play();
        this.events.next('start');
        break;

      case 'stopped':
        this.state = 'running';
        this.forward = true;
        this.totalLength = 0;
        this.elements.forEach((element, index) => {
          const length = element.getTotalLength();
          this.totalLength += length;
          this.setAttributes(element, length, length);
        });

        if (this.elements.length) {
          this.startElement(this.elements[0], 0);
        }

        this.events.next('start');
        break;
    }
  }

  pause(): void {
    if (this.state === 'running') {
      if (this.currentAnimation) {
        this.currentAnimation.pause();
      }

      this.state = 'paused';
      this.events.next('pause');
    }
  }

  stop(): void {
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
      this.currentAnimation = undefined;
      this.state = 'stopped';
      this.events.next('stop');
    }

    this.elements.forEach((element) => {
      this.removeAttributes(element);
    });
  }

  step(direction: 'forward' | 'backward'): void {
    if (this.state !== 'paused') {
      return;
    }

    if (direction === 'forward') {
      this.forward = true;
      this.currentAnimation.play();
    } else if (direction === 'backward') {
      this.forward = false;
      this.currentAnimation.reverse();
      this.currentAnimation.play();
    }
  }

  onAnimationEnd(index: number, event: any): any {
    const forward = this.forward;
    const elements = this.elements;
    const element = elements[index];
    const nextIndex = forward ? index + 1 : index - 1;
    if (forward) {
      this.removeAttributes(element);
    } else {
      const length = element.getTotalLength();
      this.setAttributes(element, length, length);
    }

    if (nextIndex === elements.length) {
      this.stop();
    } else if (nextIndex === -1) {
      this.pause();
    } else {
      this.startElement(elements[nextIndex], nextIndex);
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

  private updateInitial(elementList: QueryList<ElementRef>): void {
    if (elementList.length === 0) {
      setTimeout(this.updateInitial.bind(this, elementList), 500);
    }
    this.updateElements(elementList);
  }

  private updateElements(elementList: QueryList<ElementRef>): void {
    const orderOf = (element: SVGPathElement): number => Number(element.getAttribute('order'));
    const sorter = (e1: SVGPathElement, e2: SVGPathElement): number => orderOf(e1) - orderOf(e2);
    this.elements = elementList.map((e) => e.nativeElement as SVGPathElement);
    this.elements.sort(sorter);
  }

  private startElement(element: SVGPathElement, index: number): void {
    const length = element.getTotalLength();
    const fraction = length / this.totalLength;
    const duration = 250; // 1000 * fraction * this.duration;
    const keyframes = [{
      strokeDashoffset: length
    }, {
      strokeDashoffset: 0
    }];

    this.currentAnimation = (element as any).animate(keyframes, {duration});
    this.currentAnimation.onfinish = this.onAnimationEnd.bind(this, index);
    if (this.state !== 'running') {
      this.currentAnimation.pause();
    }
  }
}
