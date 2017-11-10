import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product,ProductService ,Comment} from '../shared/product.service';
import { WebSocketService} from '../shared/web-socket.service';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product:Product;
  //商品的评论信息
   comments:Comment[];
   //用来保存星级评价和输入内容
   newRating:number = 5;
   newComment:string = "";
    //文本框隐藏
   isCommentHidden = true;
    //当前是否已经关注了这个商品
   isWatched:boolean = false;
   currentBid:number;
   subscription: Subscription;

  constructor(
            private routeInfo: ActivatedRoute,
            private productService: ProductService,
            private  wsService: WebSocketService
  ) { }

  ngOnInit() {

    let  productId:number = this.routeInfo.snapshot.params["productId"];

    this.productService.getProduct(productId).subscribe(
     product => {
     this.product = product;
     {/*获取商品的价格*/}
     this.currentBid = product.price;

     }

    );

    this.productService.getCommentsForProductId(productId).subscribe(
      comments => this.comments = comments
    );


  }

  /*评论函数*/
  addComment(){
  let comment = new Comment(0,this.product.id,new Date().toISOString(),"someone",this.newRating,this.newComment);
  this.comments.unshift(comment);

  /*星级平均值*/
  let sum = this.comments.reduce((sum,comment) => sum + comment.rating, 0);
  this.product.rating = sum / this.comments.length;

  /*提交信息后重置*/
  this.newComment = null;
  this.newRating = 5;
  this.isCommentHidden = true;
}
/*点击关注的方法(this.subscription订阅方法返回值)*/
watchProduct(){
   if(this.subscription ){
      this.subscription .unsubscribe();
      this.isWatched = false;
      this.subscription  = null;
   }else{
     this.isWatched = true;
     this.subscription = this.wsService.createObservableSocket("ws://localhost:8085",this.product.id)
     .subscribe(
     products =>{
       let product = products.find(p => p.productId === this.product.id);
       this.currentBid = product.bid;
     }

  );  
 }
}
  }


