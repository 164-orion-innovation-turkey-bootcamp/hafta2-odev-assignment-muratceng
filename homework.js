//kullanıcıdan bilgi edinmek için prompts kullanılmıştır indirmek için console a 'npm i prompts' yazınız.
const prompts = require("prompts");

//ürün stok bilgisi buraya kaydedilmiştir.
let stocks = {
  pickle: 5,
  sauce: 5,
  onion: 5,
  meatball: 5,
  chicken: 5,
  tomato: 5,
  bread: 5,
  fries: 5,
  coke: 5,
};

//Stok bilgileri kontrol edilmiştir stok objesinin değerlerinin her biri 0 dan büyük olmalıdır. bu durumda true tersi durumda false döner.
function checkStocks(stocks) {
  return Object.values(stocks).every((element) => element > 0);
}

// steps adında hashmap tannımlanmıştır bu sayede console loga yazılacak adımlar bu değişkenden çekilecektir.
const steps = new Map();
steps
  .set("1", "Sipariş alındı")
  .set("2", "Stok kontrol edildi")
  .set("3", "Köfte mi? - Tavuk mu?")
  .set("3.1.0", "Pişme derecesi kontrol edildi")
  .set("3.1.1", "Az pişmiş köfte hazırlandı")
  .set("3.1.2", "Orta pişmiş köfte hazırlandı")
  .set("3.1.3", "Çok pişmiş köfte hazırlandı")
  .set("3.1", "Tavuk hazırlandı")
  .set("3.2", "Hamburger hazırlandı")
  .set("4", "patatesler kızartıldı")
  .set("5", "İçeçek hazırlandı")
  .set("6", "Ürünler servis tepsisine konuldu.")
  .set("7", "Müşteriye servis edildi.");


// Verdiğimiz saniye boyunca bekleyip istediğimiz değişkeni konsola yazdıran fonksiyon.
function newTodo(todo, sec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(console.log(todo));
    }, sec * 1000);
  });
}

// müşterinin köfte seçmesi durumunda 
async function meatballPrep(steps, order) {
  await newTodo(steps.get("3.1.0"), 0);
  if (order.degree == "rare") {
    await newTodo(steps.get("3.1.1"), 2);
  } else if (order.degree == "medium") {
    await newTodo(steps.get("3.1.2"), 3);
  } else {
    await newTodo(steps.get("3.1.3"), 4);
  }
  await newTodo(steps.get("3.2"), 2);
}

async function chickenPrep(steps, order) {
  await newTodo(steps.get("3.1"), 3);
  await newTodo(steps.get("3.2"), 2);
}

async function menuPrep(steps, order, stocks) {
  return new Promise((resolve, reject) => {
    if (order.type == "meatball") {
      resolve(
        meatballPrep(steps, order),
        newTodo(steps.get("4"), 5),
        newTodo(steps.get("5"), 2),
        decreaseStocks(stocks, order.type)
      );
    } else {
      resolve(
        chickenPrep(steps, order),
        newTodo(steps.get("4"), 5),
        newTodo(steps.get("5"), 2),
        decreaseStocks(stocks, order.type)
      );
    }
  });
}

function decreaseStocks(stocks, meatType) {
  Object.entries(stocks).map((element) => {
    // element --> [key,value]
    // console.log(element[0],element[1])
    if (meatType == "meatball") {
      stocks[element[0]] -= 1;
      if (element[0] === "chicken") {
        stocks[element[0]]++;
      }
    } else {
      if (element[0] === "meatball") {
        stocks[element[0]]++;
      }
      stocks[element[0]] -= 1;
    }
  });
}

async function chooseType(order) {
  const response = await prompts([
    {
      type: "select",
      name: "meatType",
      message: "Tavuk burger mi Köfte Burger mi seçersiniz",
      choices: [
        { title: "Köfte", value: "meatball" },
        { title: "Tavuk", value: "chicken" },
      ],
    },
  ]);
  return response.meatType;
}

async function chooseMeatType() {
  const response = await prompts({
    type: "select",
    name: "meatType",
    message: "Köftenizin pişme derecesi ne olsun?",
    choices: [
      { title: "az pişmiş", value: "raw" },
      { title: "orta", value: "medium" },
      { title: "Çok pişmiş", value: "well" },
    ],
  });
  return response.meatType;
}

async function orderPreparation(steps, order, stocks) {
  await newTodo(steps.get("1"), 1);
  await newTodo(steps.get("2"), 2);
  
  if (checkStocks(stocks)) {
    order.type = await chooseType();
    if (order.type == "meatball") {
      order.degree = await chooseMeatType();
    }
    await menuPrep(steps, order, stocks);
    await newTodo(steps.get("6"), 1);
    await newTodo(steps.get("7"), 1);
  } else {
    console.log('stok kalmamıştır.')
    return false;
  }
}

let order = {
  type: "",
  degree: "",
};

async function shop(steps, order, stocks) {
  while (true) {
    if (await orderPreparation(steps, order, stocks)==false){
        break;
    };
    const response = await prompts([
        {
          type: "select",
          name: "isopen",
          message: "Bir sipariş daha vermek ister misiniz?",
          choices: [
            { title: "evet", value: true },
            { title: "hayır", value: false },
          ],
        },
      ]);
      if(!response.isopen){
          console.log('iyi günler dileriz.')
          break;
      }
    
  }
}

shop(steps, order, stocks);
