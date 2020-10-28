import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

  @Input('appHideHeader') toolbar: any;
  private toolbarHeight = 91;

  constructor(private render2: Renderer2, private domCtrl: DomController) { }

  ngOnInit(): void{
    this.toolbar = this.toolbar.el;
    this.domCtrl.read(()=>{
      this.toolbarHeight = this.toolbar.clientHeight;
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event){
    const scrollTop = $event.detail.scrollTop;
    let newPosition = scrollTop/5;

    if(newPosition < -this.toolbarHeight){
      newPosition = -this.toolbarHeight;
    }

    this.domCtrl.write(()=>{
      this.render2.setStyle(this.toolbar, 'top', `-${newPosition}px`);
    });
  }

}
