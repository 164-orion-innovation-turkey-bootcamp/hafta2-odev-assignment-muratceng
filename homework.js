let stocks = {
	pickle: 5,
	sauce: 2,
	onion: 5,
	meatball: 5,
	chicken: 5,
	tomato: 5,
	bread: 5,
	fries: 5,
	coke: 5,
};

function checkStocks(stocks) {
	return Object.values(stocks).every((element) => element > 0);
}

const steps = new Map();

steps.set('1','Sipariş alındı')
.set('2','Stok kontrol edildi')
.set('3','Köfte mi? - Tavuk mu?')
.set('3.1.0','Pişme derecesi kontrol edildi')
.set('3.1.1','Az pişmiş köfte hazırlandı')
.set('3.1.2','Orta pişmiş köfte hazırlandı')
.set('3.1.3','Çok pişmiş köfte hazırlandı')
.set('3.1','Tavuk hazırlandı')
.set('3.2','Hamburger hazırlandı')
.set('4','patatesler kızartıldı')
.set('5','İçeçek hazırlandı')
.set('6','Ürünler servis tepsisine konuldu.')
.set('7','Müşteriye servis edildi.');

function newTodo(todo, sec) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(console.log(todo));
		}, sec*1000);
	});
}

async function meatballPrep(steps,order){
    await newTodo(steps.get('3.1.0'),0);
    if(order.degree=='rare'){
        await newTodo(steps.get('3.1.1'),2);
    }else if(order.degree == 'medium'){
        await newTodo(steps.get('3.1.2'),3);
    }else{
        await newTodo(steps.get('3.1.3'),4);
    }
    await newTodo(steps.get('3.2'),2);

}

async function chickenPrep(steps,order){
    await newTodo(steps.get('3.1.0'),0);
    await newTodo(steps.get('3.1'),3);
    await newTodo(steps.get('3.2'),2);

}

function menuPrep(steps,order){
    return new Promise((resolve,reject)=>{
        chickenPrep(steps,order);
        newTodo(steps.get('4'),5);
        newTodo(steps.get('5'),2);
        resolve();
    });
   
}

async function orderPreparation(steps,order){
    await newTodo(steps.get('1'),1);
    await newTodo(steps.get('2'),2);
    await menuPrep(steps,order);
    await newTodo(steps.get('6'),1);
    await newTodo(steps.get('7'),1);
}

 let order={
     type:'meatball',
     degree:'rare'
 }

 orderPreparation(steps,order);
 


