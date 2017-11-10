import { Injectable,EventEmitter } from '@angular/core';
import { Http,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';



@Injectable()
export class ProductService {
  //搜索事件流
  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();

  constructor(private http:Http) {
  }
  getAllCategories():string[]{
    return ["电子产品","硬件设备","图书"];
  }
   //第一个方法获取所有的商品信息
  getProducts(): Observable<Product[]>{
   return this.http.get("/api/products").map(res => res.json());
  }
  //第二个方法运用id来返回信息
   getProduct(id:number):Observable<Product>{
     return this.http.get("/api/product/"+id).map(res => res.json());
   }

   //第三个方法根据ID来返回这个商品的评论信息
getCommentsForProductId(id:number) :Observable< Comment[]>{
	return this.http.get("/api/product/"+id+"/comments").map(res => res.json());
}
  //与服务器构建搜索的search方法
   search(params: ProductSearchParams):Observable<Product[]>{
      return this.http.get("/api/products",{search:this.encodeParams(params) }).map(res => res.json());
   }
   
    private encodeParams(params: ProductSearchParams){
    
      return Object.keys(params)
       .filter(key => params[key])
       .reduce((sum:URLSearchParams, key:string) => {
         sum.append(key,params[key]);
         return sum;
       },new URLSearchParams());

    }
}
//搜索参数
export class ProductSearchParams {
    constructor(
             public title:string,
             public price:number,
             public category:string

    ){}
}

export class Product {
	constructor(
        public id:number,
        public title:string,
        public price:number,
        public rating:number,
        public desc:string,
        public categories:Array<string>,

	){

	}
}
//第三个方法创建一个评论信息函数
export class Comment {
	constructor(
        public id:number,
        public productId:number,
        public timestamp:string,
        public user:string,
        public rating:number,
        public content:string
	){

	}
}
