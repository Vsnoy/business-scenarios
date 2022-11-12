// 历史记录默认最大展开的行数
const MAX_LINE_NUM = 2;

// 历史搜索关键词列表 （完整，未截取）
let total_key_list = [];

// 历史搜索关键词列表 （不一定完整，截取，实际展示）
let slice_key_list = [];

// 历史记录展开收起标识显隐标记变量
let flag = false;

// 防抖
const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// 检查历史搜索行数
const checkHistoryLine = () => {
  const parent_div = document.querySelector(".history");

  // children 拿到的是 HTMLCollection 类数组，需要手动转为数组
  const childs = [...parent_div.children];

  // 当前历史记录行数
  let current_line_num = 0;
  // 历史记录默认最大展开的行数下一行起，首个关键词的 index
  let idx = 0;

  childs.forEach((item, index) => {
    // 有几个关键词距离历史记录盒子左边为 0，则代表有几行历史记录
    if (item.offsetLeft === 0) {
      current_line_num++;

      // 当前历史记录行数超过规定默认展示的行数时，要进行截断，并显示展开收起标识
      if (current_line_num === MAX_LINE_NUM + 1) {
        idx = index;
        flag = true;
      }
    }
  });

  if (idx > 0) {
    // slice 方法截取去尾，再加上尾是 idx - 1
    // 则截取的是默认最大展示的行数中除最后一个所有的
    // 留一个位置是为了放展开收起标识
    slice_key_list = total_key_list.slice(0, idx - 1);
  } else {
    slice_key_list = total_key_list;
  }
};

// 渲染历史搜索记录
const renderHistoryList = (type) => {
  const parent_div = document.querySelector(".history");
  parent_div.innerHTML = "";

  const key_list = type === "total" ? total_key_list : slice_key_list;

  for (item of key_list) {
    const child_div = document.createElement("div");
    child_div.className = "key";
    child_div.innerText = item;
    child_div.style.cursor = "pointer";
    child_div.addEventListener("click", (e) => {
      handleTotalKeyList(e.target.innerText);
      renderHistoryList(type);
    });

    parent_div.appendChild(child_div);
  }
};

// 渲染展开收起按钮
const renderCollapseBtn = (type) => {
  const parent_div = document.querySelector(".history");
  const child_div = document.createElement("div");

  const text = type === "total" ? "展开" : "收起";

  child_div.className = "key";
  child_div.innerText = text;
  child_div.style.cursor = "pointer";
  child_div.style.color = "white";
  child_div.style.backgroundColor = "black";
  child_div.addEventListener("click", (e) => {
    if (e.target.innerText === "展开") {
      renderHistoryList("total");
      renderCollapseBtn("slice");
    } else {
      renderHistoryList("slice");
      renderCollapseBtn("total");
    }
  });

  parent_div.appendChild(child_div);
};

// 处理历史搜索关键词列表
const handleTotalKeyList = (key_value) => {
  // 方式一
  // if (total_key_list.includes(key_value)) {
  //   const index = total_key_list.indexOf(key_value);
  //   total_key_list.splice(index, 1);
  //   total_key_list.unshift(key_value);
  // } else {
  //   total_key_list.unshift(key_value);
  // }

  // 方式二
  total_key_list.unshift(key_value);
  total_key_list = [...new Set(total_key_list)];
};

// input 按下按键时触发
const handleEnter = (e) => {
  // 按下的不为 enter 键，直接返回
  if (e.key !== "Enter") return;

  // 按下的是 enter 键，但内容为空，直接返回
  if (e.target.value.trim() === "") return;

  const key_value = e.target.value.trim();

  handleTotalKeyList(key_value);
  renderHistoryList("total");
  checkHistoryLine();
  renderHistoryList("slice");

  flag && renderCollapseBtn("total");
};

const input = document.querySelector("input");
input.addEventListener("keydown", debounce(handleEnter, 500));
