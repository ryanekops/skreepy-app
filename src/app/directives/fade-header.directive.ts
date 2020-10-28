import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appFadeHeader]'
})
export class FadeHeaderDirective implements OnInit {

  @Input('appFadeHeader') footer: any;
  private footerHeight = 60;

  constructor(private render2: Renderer2, private domCtrl: DomController) { }

  ngOnInit(): void{
    this.footer = this.footer.el;
    this.domCtrl.read(()=>{
      this.footerHeight = this.footer.clientHeight;
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event){
    const scrollTop = $event.detail;
    if(scrollTop.deltaY > 0){
      this.domCtrl.write(()=>{
        this.render2.setAttribute(this.footer,'data-show', 'false');
      });
    }else{
      this.domCtrl.write(()=>{
        this.render2.setAttribute(this.footer,'data-show', 'true');
      });
    }
  }

}
