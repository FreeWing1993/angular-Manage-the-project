import { Component, OnInit, Input ,EventEmitter,Output,SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
   输入属性
  @Input()
  private rating:number = 0;

  //输出属性
  @Output()
  private ratingChange:EventEmitter<number> = new EventEmitter();

  private stars:boolean[];
   //控制星星是否可以点击只读状态
   @Input()
  private readonly:boolean = true;

  constructor() { }

  ngOnInit() {
 
 
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stars = [];
   for (let i = 1; i<=5;i++){
     this.stars.push(i > this.rating);
   }

  }
  clickStart(index:number){
  if(!this.readonly){
   this.rating = index + 1;
   this.ratingChange.emit(this.rating);
  }

  }

}
