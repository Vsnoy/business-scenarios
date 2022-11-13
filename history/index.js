// 历史搜索关键词最大存储的数量
const MAX_KEY_NUM = 10;

// 历史记录默认最大展开的行数
const MAX_LINE_NUM = 2;

// 当前搜索关键词
let key_value = "";

// 历史搜索关键词列表 （截取）
let slice_key_list = [];

// 最终显示的历史搜索关键词列表
let final_key_list = [];

// 展示收起按钮是否显示
let flag = false;

// 展示收起按钮当前展示的文案
let tip = "";

// 历史记录默认最大展开的行数下一行起，首个关键词的 index
let idx = 0;

// 防抖
const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// 检查历史记录行数是否超出
const checkHistoryLine = () => {
  const parent_div = document.querySelector(".history");
  const childs = [...parent_div.children];

  // 当前历史记录行数
  let current_line_num = 0;

  idx = 0;
  for (const [index, item] of childs.entries()) {
    // 有几个关键词距离历史记录盒子左边为 0，则代表有几行历史记录
    if (item.offsetLeft === 0) {
      current_line_num++;

      // 若当前历史记录行数超过规定默认展示的行数时，则首次加载进入该页面时需要截断
      // 若非首次加载，已经设置了展开收起的状态，则保持住当前状态即可
      if (current_line_num === MAX_LINE_NUM + 1) {
        idx = index;
        tip = tip ? tip : "展开";
        flag = true;

        break;
      }
    }
  }
};

// 渲染展开收起按钮
const renderCollapseBtn = () => {
  const parent_div = document.querySelector(".history");
  const child_div = document.createElement("div");

  child_div.className = "key";
  child_div.innerText = tip;
  child_div.style.cursor = "pointer";
  child_div.style.color = "white";
  child_div.style.backgroundColor = "black";
  child_div.addEventListener("click", (e) => {
    if (tip === "展开") {
      tip = "收起";
      handleFinalKeyList();
      renderFinalHistoryList();
    } else {
      tip = "展开";
      handleFinalKeyList();
      renderFinalHistoryList();
    }
  });

  parent_div.appendChild(child_div);
};

// 渲染历史搜索记录 （不一定完整，截取）
const renderFinalHistoryList = () => {
  const parent_div = document.querySelector(".history");
  parent_div.innerHTML = "";

  for (item of final_key_list) {
    const child_div = document.createElement("div");
    child_div.className = "key";
    child_div.innerText = item;
    child_div.style.cursor = "pointer";
    child_div.addEventListener("click", (e) => {
      key_value = e.target.innerText;
      executeStandardFlow();
    });

    parent_div.appendChild(child_div);
  }

  flag && renderCollapseBtn();
};

// 渲染历史搜索记录 （完整，未截取）
const renderTotalHistoryList = () => {
  const parent_div = document.querySelector(".history");
  parent_div.innerHTML = "";

  const total_key_list =
    JSON.parse(localStorage.getItem("total_key_list")) ?? [];

  for (item of total_key_list) {
    const child_div = document.createElement("div");
    child_div.className = "key";
    child_div.innerText = item;

    parent_div.appendChild(child_div);
  }
};

// 处理历史搜索关键词列表（不一定完整，截取）
const handleFinalKeyList = () => {
  const total_key_list =
    JSON.parse(localStorage.getItem("total_key_list")) ?? [];

  // 若截取则在应截取的基础上去掉一个，用来放置展开收起按钮
  if (idx > 0) {
    slice_key_list = total_key_list.slice(0, idx - 1);
  }

  final_key_list = tip === "展开" ? slice_key_list : total_key_list;
};

// 处理历史搜索关键词列表（完整，未截取）
const handleTotalKeyList = () => {
  // 首次加载进入该页面，关键词为空，展示 localStorage 中已有的历史记录
  if (key_value === "") return;

  // 从 localStorage 中取出之前的完整历史搜索关键词列表
  let total_key_list = JSON.parse(localStorage.getItem("total_key_list")) ?? [];

  total_key_list.unshift(key_value);
  total_key_list = [...new Set(total_key_list)];

  // 若超出最大允许存储的历史关键词数量，则去掉最后一个关键词
  if (total_key_list.length > MAX_KEY_NUM) {
    total_key_list.pop();
  }

  // 处理完成后，将最新的完整历史搜索关键词列表存储到 localStorage 中
  localStorage.setItem("total_key_list", JSON.stringify(total_key_list));
};

// 执行标准流程
// 1. 处理完整历史关键词列表
// 2. 渲染完整历史关键词列表
// 3. 检查历史记录是否超出限定行
// 4. 处理最终显示历史关键词列表
// 5. 渲染最终显示历史关键词列表
const executeStandardFlow = () => {
  handleTotalKeyList();
  renderTotalHistoryList();

  checkHistoryLine();

  handleFinalKeyList();
  renderFinalHistoryList();
};

// 按下按键时触发
const handleEnter = (e) => {
  // 按下的不为 enter 键，直接返回
  if (e.key !== "Enter") return;

  // 按下的是 enter 键，但内容为空，直接返回
  key_value = e.target.value.trim();
  if (key_value === "") return;

  // 执行标准流程
  executeStandardFlow();
};

const input = document.querySelector("input");
input.addEventListener("keydown", debounce(handleEnter, 500));

executeStandardFlow();
