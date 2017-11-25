/**
 * Created by huyiwen1 on 2017/5/17.
 */
import * as express from 'express';
import * as path from 'path';

import {Server} from 'ws';

const app  = express();
//app.get('/',(req, res) => res.send('Hello Auction'));
app.use('/',express.static(path.join(__dirname, '..', 'client')));
export class Product {
    constructor(
        public id:number,
        public title:string,
        public price:number,
        public rating:number,
        public desc:string,
        public categories:Array<string>,){

    }
}
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
const products: Product[]  = [
    new Product(1,"第一个商品",1.99,3.5,"这是第一个商品的描述",["电子产品","硬件设备"]),
    new Product(2,"第二个商品",2.99,2.5,"这是第二个商品的描述",["图书"]),
    new Product(3,"第三个商品",3.99,4.5,"这是第三个商品的描述",["硬件设备"]),
    new Product(4,"第四个商品",4.99,1.5,"这是第四个商品的描述",["电子产品","硬件设备"]),
    new Product(5,"第五个商品",5.99,2.5,"这是第五个商品的描述",["电子产品"]),
    new Product(6,"第六个商品",6.99,3.5,"这是第六个商品的描述",["图书"])
];

const comments:Comment[] = [
    new Comment(1,1,"2017-02-02 22:22:22","张三",3,"东西不错"),
    new Comment(2,1,"2016-02-04 23:23:23","李四",2,"可以"),
    new Comment(3,4,"2013-02-05 11:11:11","王五",4,"欧呦不错哦"),
    new Comment(4,2,"2015-02-07 12:22:30","麻子",5,"还可以"),

];


app.get('/api/products' , (req,res) => {
    let result = products;
    let params = req.query;

    if(params.title){
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }

    if(params.price && result.length > 0 ){
        result = result.filter((p) => p.price <= parseInt(params.price));
    }

    if(params.category !== "-1" && result.length > 0 ){
        result = result.filter((p) => p.categories.indexOf(params.category)!== -1);
    }


    res.json(result);
});

app.get('/api/product/:id' , (req,res) => {
    res.json(products.find((product) => product.id == req.params.id));
});
app.get('/api/product/:id/comments' , (req,res) => {
    res.json(comments.filter((comment:Comment) => comment.productId == req.params.id));
});
const server = app.listen(8001,"localhost",() =>{
    console.log("服务器已启动，地址是: http://localhost:8001");
});

/*关注信息any是所有的商品number[]是关注的商品*/
const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port: 8085});

wsServer.on("connection", websocket => {

    websocket.on("message",message => {
        let  messageObj = JSON.parse(message);
        let productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, [...productIds, messageObj.productId]);
    });
});
/*模拟每个商品最新的价格(总共六个商品)*/
const currentBids = new Map<number,number>();


/*p指的是products中的商品*/
setInterval(() => {
    products.forEach( p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach((productIds:number[], ws) => {
        if(ws.readyState === 1){
            let newBids = productIds.map( pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }));
            ws.send(JSON.stringify(newBids));
        }else{
            subscriptions.delete(ws);
        }

    });
},2000);