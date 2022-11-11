// 搜索关键词列表
let key_list = [];

// 防抖
const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// 渲染历史搜索记录
const renderHistoryList = () => {
  const parent_div = document.querySelector(".history");
  parent_div.innerHTML = "";

  for (item of key_list) {
    const child_div = document.createElement("div");
    child_div.className = "key";
    child_div.innerText = item;
    child_div.style.cursor = "pointer";
    child_div.addEventListener("click", (e) => {
      handleKeyList(e.target.innerText);
      renderHistoryList();
    });

    parent_div.appendChild(child_div);
  }
};

// 处理关键词列表
const handleKeyList = (key_value) => {
  // 方式一
  // if (key_list.includes(key_value)) {
  //   const index = key_list.indexOf(key_value);
  //   key_list.splice(index, 1);
  //   key_list.unshift(key_value);
  // } else {
  //   key_list.unshift(key_value);
  // }

  // 方式二
  key_list.unshift(key_value);
  key_list = [...new Set(key_list)];
};

// input 按下按键时触发
const handleEnter = (e) => {
  // 按下的不为 enter 键，直接返回
  if (e.key !== "Enter") return;

  // 按下的是 enter 键，但内容为空，直接返回
  if (e.target.value.trim() === "") return;

  const key_value = e.target.value.trim();

  handleKeyList(key_value);

  renderHistoryList();
};

const input = document.querySelector("input");
input.addEventListener("keydown", debounce(handleEnter, 500));
