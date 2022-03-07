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

// müşterinin köfte seçtiği durumda todolar üreten fonksiyon
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

// müşterinin tavuk seçtiği durumda todolar üreten fonksiyon
async function chickenPrep(steps, order) {
  await newTodo(steps.get("3.1"), 3);
  await newTodo(steps.get("3.2"), 2);
}

// müşterinin siparişinde 3,4,5 adımları aynı anda yürütülmesi gereken adımlardır bu amac icin promise dönen fonksiyondur.
function menuPrep(steps, order, stocks) {
  return new Promise((resolve, reject) => {
    if (order.type == "meatball") {
      // resolve içerisine todolar verildiği için bu todolar senkronize çalışır ve hepsinin işini bitirmesi beklenir.
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

// stok sayılarını azaltan fonksiyon
function decreaseStocks(stocks, meatType) {
  Object.entries(stocks).map((element) => {
    // stok listesini key,value olarak döner element[0] key değerini ifade eder.
    // köfte veya tavuk olması durumuna göre azaltma işlemi gerçekleştirir.
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

// prompts kullanarak müşterinin köfte tavuk seçimi yapmasını sağlar.
async function chooseType(order) {
  const response = await prompts([
    {
      // select tipi seçim yapma tipidir name cevabın atanacağı değişkendir. mesaj sorulacak soru, seçeneklerde title
      // kullanıcıya görünen value bize ulaşan değerdir.
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

// prompts kullanarak müşterinin köftesinin pişme derecesini seçmesini sağlar sağlar.
async function chooseMeatType() {
  const response = await prompts({
    // select tipi seçim yapma tipidir name cevabın atanacağı değişkendir. mesaj sorulacak soru, seçeneklerde title
    // kullanıcıya görünen value bize ulaşan değerdir.
    type: "select",
    name: "meatType",
    message: "Köftenizin pişme derecesi ne olsun?",
    choices: [
      { title: "az pişmiş", value: "rare" },
      { title: "orta", value: "medium" },
      { title: "Çok pişmiş", value: "well" },
    ],
  });
  return response.meatType;
}

// tüm sipariş döngüsünün yer aldığı fonksiyondur. stok bittiği durumda false döner.
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
    console.log("stok kalmamıştır.");
    return false;
  }
}

// order tanımı
let order = {
  type: "",
  degree: "",
};

// dükkanın yönetimini sağlayan fonksiyondur. stok bitmedikçe ve müşteri sipariş istedikçe sonsuz döngüde çalışmaktadır.
async function shop(steps, order, stocks) {
  while (true) {
    // orderpreparation stok bittiği durumda false değeri dönmektedir bu durumda döngü kırılır.
    if ((await orderPreparation(steps, order, stocks)) == false) {
      break;
    }
    //müşterinin yeni bir sipariş isteme durumunu yöneten promptsdur. cevap response a atanır.
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
    //response false olduğu durumda döngü kırılır.
    if (!response.isopen) {
      console.log("iyi günler dileriz.");
      break;
    }
  }
}

// program başlatılmıştır.
shop(steps, order, stocks);
