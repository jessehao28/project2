let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

const time_line = new TimelineMax();

// parameter1: 是要控制的對象
// parameter2: 是 duration (動畫要動多久?)
// parameter3: 是控制的對象的原始狀態
// parameter4: 是控制對象的動畫結束後的狀態
// parameter5: 是控制提早跑的時間
time_line
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500);

// 這邊監聽 "keydown" 或 "keypress" 都可以
// 讓整個網站的 Enter 鍵，都無法使用
window.addEventListener("keypress", (e) => {
  //   console.log(e);
  if (e.key == "Enter") {
    e.preventDefault();
  }
});

// 防止 form 內部的 button 交出表單
// 先用 quertSelectorAll 找出所有的按鈕，預設回傳 NodeList
// 注意: querySelectorAll 的 return type: NodeList，所以可以使用 forEach()
// 使用 forEach() 對每一個 element node 增加監聽的功能
let allButtons = document.querySelectorAll("button");
// console.log(allButtons);  // return a NodeList
allButtons.forEach((button) => {
  //   console.log(button);
  button.addEventListener("click", (e) => {
    // console.log(e);
    e.preventDefault();
  });
});

// 改變學分數之後，也要更新計算 setGPA()
// 1) 先做好選擇器: 學分 (NodeList)
// 2) 用 forEach() 找出每一個元素(物件)
// 3) 增加監聽事件，當物件的狀態改變時 (change event) -> 更新計算 GPA
let allCredits = document.querySelectorAll(".class-credit");
// console.log(allCredits);
allCredits.forEach((credit) => {
  credit.addEventListener("change", () => {
    // console.log(e);
    setGPA();
  });
});

// 改變成績選擇器的背景顏色
// 選擇 select 內的 option 之後，要改變相對應的顏色
// 先從選擇器選出所有的 selects，回傳型別是 NodeList
// 因為是 NodeList，所以可以做 forEach()
// 再用 forEach() 對每一個 element object 做監聽
// 當監聽的物件(成績選擇器)發生 "change" 事件時，就是 select 做出改變時
// 找到物件的 target.value，並改變背景顏色
let allSelects = document.querySelectorAll("select"); // 回傳靜態的 NodeList
// console.log(allSelects);
allSelects.forEach((select) => {
  //   console.log(select);
  select.addEventListener("change", (e) => {
    // 注意: 這邊要指到 e.target，之後才能再指到 target 底下的 value
    // console.log(e);
    // console.log(e.target);
    // 更動 GPA 運算結果
    setGPA();
    // console.log(e.target.value); // e.target.value 就是 A- 這種
    changeColor(e.target); // e.target 就是 <select>
  });
});

function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style.backgroundColor = "lightgreen";
    target.style.color = "black";
  } else if (
    target.value == "B+" ||
    target.value == "B" ||
    target.value == "B-"
  ) {
    target.style.backgroundColor = "yellow";
    target.style.color = "black";
  } else if (
    target.value == "C+" ||
    target.value == "C" ||
    target.value == "C-"
  ) {
    target.style.backgroundColor = "orange";
    target.style.color = "black";
  } else if (
    target.value == "D+" ||
    target.value == "D" ||
    target.value == "D-"
  ) {
    target.style.backgroundColor = "red";
    target.style.color = "black";
  } else if (target.value == "F") {
    target.style.backgroundColor = "grey";
    target.style.color = "white";
  } else {
    target.style.backgroundColor = "white";
  }
}

function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

function setGPA() {
  //   console.log("正在執行 setGPA...");
  // 取得選擇器: 表單 (是一個 NodeList)，那個 NodeList 的長度
  let formLength = document.querySelectorAll("form").length;
  // 取得選擇器: 學分 (也是一個 NodeList)
  let credits = document.querySelectorAll(".class-credit");
  //   console.log(credits);
  // 取得選擇器: 成績 (NodeList)
  let selects = document.querySelectorAll("select");
  //   console.log(selects);
  let sum = 0; // GPA計算用分子
  let creditSum = 0; // GPA計算用分母

  // 計算分母
  for (let i = 0; i < credits.length; i++) {
    // console.log(credits[i]); // 找到 credits 物件的一個屬性: valueAsNumber
    // console.log(credits[i].valueAsNumber);
    // 確認 credits[i].valueAsNumber 的值是不是 NaN，如果不是 NaN 就拿去加總
    if (!isNaN(credits[i].valueAsNumber)) {
      creditSum += credits[i].valueAsNumber;
    }
  }
  //   console.log("分母 = " + creditSum);

  // 計算分子
  for (let i = 0; i < formLength; i++) {
    // console.log(convertor(selects[i].value));
    // 確認 credits[i].valueAsNumber 的值是不是 NaN，如果不是 NaN 就拿去計算
    if (!isNaN(credits[i].valueAsNumber)) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }
  //   console.log("分子 = " + sum);

  // 計算 GPA
  // 1) 排除 分母為 0 的狀況
  // 2) 去掉小數點後面多餘的小數
  let result;
  if (creditSum == 0) {
    result = (0.0).toFixed(2);
  } else {
    result = (sum / creditSum).toFixed(2);
  }

  // 更新在網頁上的 GPA 結果
  document.querySelector("#result-gpa").innerText = result;
  //   document.getElementById("result-gpa").innerText = result;
}

// 點擊 + 鍵，產生新的表單
// 1) 先做好 + 按鈕的選擇器
// 2) 對 + 按鈕增加監聽器，監聽 click 事件
// 3) 當 click 事件發生時，建立新的 form 元素
// 4) 當 click 事件發生時，建立 form 底下的 div 元素，因為該 div 有 class 名稱叫 grader，所以使用 classList.add(grader) 加入
let addBtn = document.querySelector(".plus-btn");
// console.log(addBtn);
addBtn.addEventListener("click", () => {
  //   console.log(e);
  let newForm = document.createElement("form");
  let newDiv = document.createElement("Div");
  newDiv.classList.add("grader");

  // 製作 5 個小元素，分別是:
  // 1) 兩個 text 的 input 元素
  // 2) 一個 number 的 input 元素
  // 3) 一個 select 的元素
  // 4) 一個 trash-button 元素

  // 建立一個新元素 newInput1
  let newInput1 = document.createElement("input");
  // 設定標籤屬性 type 及其內容
  newInput1.setAttribute("type", "text");
  // 設定標籤屬性 list 及其內容
  newInput1.setAttribute("list", "opt");
  // 設定標籤屬性及其內容
  // newInput1.setAttribute("placeholder", "class category");
  // 設定 class 名稱
  newInput1.classList.add("class-type");

  // 建立新元素 newInput2
  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text");
  // newInput2.setAttribute("placeholder", "class number");
  newInput2.classList.add("class-number");

  // 建立新元素 newInput3
  let newInput3 = document.createElement("input");
  newInput3.setAttribute("type", "number");
  // newInput3.setAttribute("placeholder", "credits");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.classList.add("class-credit");

  // 這個 newInput3 物件是 credit 學分，所以新增時，要記得更新計算 GPA
  // 新增 newInput3 學分物件的監聽器，當事件 change 時，去執行 setGPA()
  newInput3.addEventListener("change", () => {
    setGPA();
  });

  // here is the select tag
  // 建立新元素 select
  let newSelect = document.createElement("select");
  // newSelect.setAttribute("name", "select");
  newSelect.classList.add("select");

  // 老師教的: 建立 option 元素 start **** //
  // 建立新元素 option
  // 這邊資料比較多，也可以使用 for 迴圈建立，但下列程式碼使用一般方式建立
  // 使用 for 迴圈建立方法再另外寫出來
  let opt1 = document.createElement("option");
  // 設定新元素 option 的屬性及其內容
  opt1.setAttribute("value", "");
  // 建立新的文字節點，並給定其值
  let textNode1 = document.createTextNode("");
  // 在 opt1 底下，新增 textNode1 文字節點內容
  opt1.appendChild(textNode1);

  let opt2 = document.createElement("option");
  opt2.setAttribute("value", "A");
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);

  let opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-");
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);

  let opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+");
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);

  let opt5 = document.createElement("option");
  opt5.setAttribute("value", "B");
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);

  let opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-");
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);

  let opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+");
  opt7.appendChild(textNode7);

  let opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C");
  opt8.appendChild(textNode8);

  let opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-");
  opt9.appendChild(textNode9);

  let opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+");
  opt10.appendChild(textNode10);

  let opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D");
  opt11.appendChild(textNode11);

  let opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-");
  opt12.appendChild(textNode12);

  let opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F");
  opt13.appendChild(textNode13);
  // 老師教的: 建立 option 元素 end **** //

  // 建立新元素 trash-can btn
  let newTrashBtn = document.createElement("button");
  newTrashBtn.classList.add("trash-button");
  // 建立新元素 i tag
  let newItag = document.createElement("i");
  newItag.classList.add("fas");
  newItag.classList.add("fa-trash");
  // 在 newTrashBtn 底下，新增 newItag 元素
  newTrashBtn.appendChild(newItag);

  // 增加垃圾桶 trash btn 的監聽器
  // 1) 新增 click 事件，當事件觸發時，執行 preventDefault()
  // 2) 針對 e.target.parentElement.parentElement (form) 做 style 的動畫調整
  // 3) 在 trash-btn 的 click 事件觸發時，執行動畫時，又針對 trash-btn 的 parentElement 的 parentElement (即 form) 去監聽一個 anamationend 事件
  // 4) 當 animationend 事件觸發時，對該事件 e.target (即 form 本身) 做 remove() 動作
  newTrashBtn.addEventListener("click", (e) => {
    // console.log(e);
    // console.log(e.target);
    // console.log(e.target.parentElement);
    // console.log(e.target.parentElement.parentElement);
    // e 是 click 本身的 trash btn
    // e.target 是 trash btn 本身
    // e.target.parentElement 是 div.grader
    // e.target.parentElement.parentElement 是 form
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    // 監聽 form 物件的 animationend 動畫結束後的事件
    e.target.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        // console.log(e);
        // console.log(e.target); // 指的是 form 本身
        e.target.remove(); // e.target = form
        setGPA();
      }
    );
  });

  // 在 newSelect 底下，新增 option (opt1 ~ opt13) 元素
  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);

  // 這邊要再增加監聽器，監聽 change 的原因是因為點擊 + 所新增的表單的 select 並不會在上面的 allSelects 監聽到，因為 allSelects 監聽的範圍只限原有的三個 form，對於新增的 form 並沒有監聽的功能
  // 所以這邊要自己再增加一次監聽 change 事件
  newSelect.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  });

  //   // *** 練習使用 for 迴圈 建立 select 新元素 start ***
  //   let arrGrade = [
  //     "",
  //     "A",
  //     "A-",
  //     "B+",
  //     "B",
  //     "B-",
  //     "C+",
  //     "C",
  //     "C-",
  //     "D+",
  //     "D",
  //     "D-",
  //     "F",
  //   ];

  //   let opt1,
  //     opt2,
  //     opt3,
  //     opt4,
  //     opt5,
  //     opt6,
  //     opt7,
  //     opt8,
  //     opt9,
  //     opt10,
  //     opt11,
  //     opt12,
  //     opt13;
  //   let options = [
  //     opt1,
  //     opt2,
  //     opt3,
  //     opt4,
  //     opt5,
  //     opt6,
  //     opt7,
  //     opt8,
  //     opt9,
  //     opt10,
  //     opt11,
  //     opt12,
  //     opt13,
  //   ];

  //   let textNode1,
  //     textNode2,
  //     textNode3,
  //     textNode4,
  //     textNode5,
  //     textNode6,
  //     textNode7,
  //     textNode8,
  //     textNode9,
  //     textNode10,
  //     textNode11,
  //     textNode12,
  //     textNode13;
  //   let textNodes = [
  //     textNode1,
  //     textNode2,
  //     textNode3,
  //     textNode4,
  //     textNode5,
  //     textNode6,
  //     textNode7,
  //     textNode8,
  //     textNode9,
  //     textNode10,
  //     textNode11,
  //     textNode12,
  //     textNode13,
  //   ];

  //   for (let i = 0; i < arrGrade.length; i++) {
  //     options[i] = document.createElement("option");
  //     options[i] = setAttribute("value", arrGrade[i]);
  //     textNodes[i] = document.createTextNode(arrGrade[i]);
  //     options[i] = appendChild(textNodes[i]);
  //   }
  //   // *** 練習使用 for 迴圈 建立 select 新元素 end ***

  // 把 select 加到 div 裡

  // 1) 先把 input 加到 div 裡
  // 2) 再把 div 加到 form 裡
  // 3) 再把 form 加到 class 為 "all-inputs" 的 div 裡
  // 4) 上述動作都是 由內往外加

  // 在 div 底下，新增三個 newInput1, newInput2, newInput3 元素(物件)
  // 把上面建立好的 input 新元素，從這邊開始 appendChild() 進來
  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newTrashBtn);
  // 在 form 底下，新增剛剛做好的三個 newDiv 元素
  newForm.appendChild(newDiv);
  // 選取 "all-inputs" 外層的 div，在這裡面新增剛剛做好的 form 元素進去
  document.querySelector(".all-inputs").append(newForm);
  // 總結: 感覺是先從最裡面的元素做出來後，再加到外面一層，逐漸往上一層 appendChild()

  // 新增按 + 鍵增加 form 時，由小到大跑出來的特效
  newForm.style.animation = "scaleUp 0.5s ease forwards";
});

// 做 垃圾桶的選擇器，回傳 NodeList
let allTrashBtn = document.querySelectorAll(".trash-button");
// console.log(allTrashBtn);
// 對 trash 的 NodeList 做 forEach()，找出個別的 trash btn
allTrashBtn.forEach((trashBtn) => {
  //   console.log(trashBtn);
  // 對每一個 trashBtn 增加監聽功能，監聽 click 事件
  // e 是 click 事件的 target
  // e.target 是 trashBtn 本身
  // e.target.parentElement 是 div.grader 本身
  // e.target.parentElement.parentElement 是 form 本身
  trashBtn.addEventListener("click", (e) => {
    // console.log(e.target.parentElement.parentElement);
    // 在 remove() 之前，做一個逐漸縮小 form 的動畫
    // 1) 在 form 底下，做一個 remove class
    e.target.parentElement.parentElement.classList.add("remove");
    // e.target.parentElement.parentElement.remove();
  });
});

// 再次對 allTrashBtn 的 NodeList 做 forEach() 動作
// 延遲等垃圾桶移除動作縮小跑完後，再執行 remove() 動作
allTrashBtn.forEach((trashBtn) => {
  // 1) 宣告一個 form 物件
  // 1-1) transBtn.parentElement 是 div.grader
  // 1-2) transBtn.parentElement.parentElement 是 form
  // 2) 對 form 增加監聽功能，監聽 transitionend 事件
  // 3) 當觸發事件時，對 e.target (即 form 本身) 做 remove() 動作
  // 4) 記得重設 GPA
  let form = trashBtn.parentElement.parentElement;
  form.addEventListener("transitionend", (e) => {
    // console.log(e);
    // e.target 是指 form 本身
    e.target.remove();
    setGPA();
  });
});

// merge sort 合併排序演算法
// 1) 做好選取器 (降序、升序)
// 2) 設置監聽器 (降序、升序)，監聽 click 事件
// 3) 當 click 事件發生時，執行 handleSorting(direction) 函式
let sortDescBtn = document.querySelector(".sort-descending");
// console.log(sortDescBtn);
let sortAsceBtn = document.querySelector(".sort-ascending");
// console.log(sortAsceBtn);

sortDescBtn.addEventListener("click", () => {
  handleSorting("descending"); // 由大到小排序
});

sortAsceBtn.addEventListener("click", () => {
  handleSorting("ascending"); // 由小到大排序
});

// 執行合併排序的 function，參數是升序 or 降序 排法
function handleSorting(direction) {
  // 與其找 form，不如直接找 grader，因為 grader 的下一層就是我們要的元素資料
  // 1) 找到所有 grader 的選取器，回傳 type 是 NodeList
  let graders = document.querySelectorAll("div.grader"); // 寫 ".grader" 也可以
  // console.log(graders);

  // 新增一個空的陣列
  let objectArray = [];

  // 2) 用一個 for loop 跑 graders 裡所有的元素，因為 graders 是 NodeList，所以可以使用 for 迴圈
  for (let i = 0; i < graders.length; i++) {
    // console.log(graders[i]);
    // graders is a NodeList
    // graders[i].children[0] is a HTMLCollection
    // 注意: 以下這四個變數是值都是 string
    let class_name = graders[i].children[0].value; // <input> class category
    let class_number = graders[i].children[1].value; // <input> class number
    let class_credit = graders[i].children[2].value; // <input> credits
    let class_grade = graders[i].children[3].value; // <select> grade

    // 注意: 這四個欄位的值都是 string
    // console.log(class_name, class_number, class_credit, class_grade);

    // 把上面四個變數，做成一個物件，注意物件的語法是 : 跟 , 還有 {}
    // 排除掉 graders 裡的元素是空的情況，全部都空的就排除，只要有一個元素沒空就要執行 if 為 true 裡的程式
    // 假如有一個欄位不為空的情況，就製作一個 class_object，然後把 class_object 加進去 objectArray 裡面
    if (
      !(
        class_name == "" &&
        class_number == "" &&
        class_credit == "" &&
        class_grade == ""
      )
    ) {
      let class_object = {
        // class_name: class_name, // 左邊 class_name 是屬性名，右邊 class_name 是上面的變數名稱
        // class_number: class_number, // 左邊 class_number 是屬性名，右邊 class_number 是上面的變數名稱
        // class_credit: class_credit, // 左邊 class_credit 是屬性名，右邊 class_credit 是上面的變數名稱
        // class_grade: class_grade, // 左邊 class_grade 是屬性名，右邊 class_grade 是上面的變數名稱

        // 改成以下的寫法 //
        class_name,
        class_number,
        class_credit,
        class_grade,
      };
      objectArray.push(class_object);
      console.log(objectArray);
    }
  }

  // objectArray 後，把成績 class_grade (string) 換成數字 (利用之前的 convertor 函式)
  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].class_grade_number = convertor(objectArray[i].class_grade);
  }

  objectArray = mergeSort(objectArray);

  // 如果是要由大到小排序，就將 objectArray 反轉就好，因為排序 functon 是寫成是由小到大
  if (direction == "descending") {
    objectArray = objectArray.reverse();
  }
  console.log(objectArray);

  // 根據 objectArray 的內容，來更新網頁 (更新 all-inputs)
  let allInputs = document.querySelector(".all-inputs");
  // 清空 allInputs 裡面的內容，就是讓 allInputs.innerHTML = "";
  allInputs.innerHTML = "";

  // 用 objectArray 跑迴圈，把 longString 加進去 allInputs 裡，並加一個 value 的內容，分別是 class_name, class_number, class_credit
  for (let i = 0; i < objectArray.length; i++) {
    allInputs.innerHTML += `<form>
    <div class="grader">
      <input
        type="text"
        placeholder="class category"
        class="class-type"
        list="opt"
        value=${objectArray[i].class_name}
      /><!--
      --><input
        type="text"
        placeholder="class number"
        class="class-number"
        value=${objectArray[i].class_number}
      /><!--
      --><input
        type="number"
        placeholder="credits"
        min="0"
        max="6"
        class="class-credit"
        value=${objectArray[i].class_credit}
      /><!--
     --><select name="select" class="select">
        <option value=""></option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="D-">D-</option>
        <option value="F">F</option></select
      ><!--
    --><button class="trash-button">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    </form>`;
  }

  // select 可直接用 JS 去更改
  // 因為 graders 回傳的是 NodeList，是靜態的，不會自動更新，所以要重抓
  // .class_grade 是 string，存放成績 "A", "A-", "B+" ……等等這些
  graders = document.querySelectorAll("div.grader");
  for (let i = 0; i < graders.length; i++) {
    graders[i].children[3].value = objectArray[i].class_grade;
  }

  // 增加 成績 (select) 的事件監聽器
  // select 的顏色轉換
  // 選取器 > forEach() > 增加 addEventListener 監聽 change 事件 > 更新 GPA > 換顏色
  let allSelects = document.querySelectorAll("select");
  // 因為是 NodeList，所以需要做 forEach()
  allSelects.forEach((select) => {
    // 在事件監聽之前換顏色
    changeColor(select);
    select.addEventListener("change", (e) => {
      setGPA();
      changeColor(e.target);
    });
  });

  // 增加 學分 (credit) 的事件監聽器
  // 因為回傳的也是 NodeList，所以要做 forEach() > 再做監聽 change 事件
  let allCredits = document.querySelectorAll(".class-credit");
  allCredits.forEach((credit) => {
    credit.addEventListener("change", () => {
      setGPA();
    });
  });

  // 增加 垃圾桶 (trash-btn) 的事件監聽器
  // 因為回傳的也是 NodeList，所以要做 forEach() > 再做監聽 click 事件
  let allTrash = document.querySelectorAll(".trash-button");
  allTrash.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      // console.log(e);
      // console.log(e.target);
      // console.log(e.target.parentElement);
      // console.log(e.target.parentElement.parentElement);
      // e 是 click 本身的 trash btn
      // e.target 是 trash btn 本身
      // e.target.parentElement 是 div.grader
      // e.target.parentElement.parentElement 是 form
      e.preventDefault();
      e.target.parentElement.parentElement.style.animation =
        "scaleDown 0.5s ease forwards";
      // 監聽 form 物件的 animationend 動畫結束後的事件
      e.target.parentElement.parentElement.addEventListener(
        "animationend",
        (e) => {
          // console.log(e);
          // console.log(e.target); // 指的是 form 本身
          e.target.remove(); // e.target = form
          setGPA();
        }
      );
    });
  });
}

// merge sort function
// a1 代表 i 變數，a2 代表 j 變數
function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number > a2[j].class_grade_number) {
      result.push(a2[j]);
      j++;
    } else {
      result.push(a1[i]);
      i++;
    }
  }

  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }

  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  }

  // slice(): indexStart 是 include，indexEnd 是 exclude
  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right)); // 遞迴
  }
}
