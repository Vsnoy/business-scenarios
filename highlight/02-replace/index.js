// 关键词
let key_value = "";

// 原内容数组
const source_list = ["你好鸭", "今天天气真好", "又到了白色相簿的季节了"];

// 根据高亮关键词替换后的数组
let highlight_list = [];

// 防抖
const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// 以关键词为界，替换字符串
const replaceString = (item) => {
  const reg = new RegExp(`(${key_value})`, "g");
  return item.replace(reg, `<span style="color: red">${key_value}</span>`);
};

// 渲染高亮列表
const renderHighlightList = () => {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  for (item of highlight_list) {
    const li = document.createElement("li");

    li.innerHTML = item;
    ul.appendChild(li);
  }
};

// 渲染原列表
const renderSourceList = () => {
  const ul = document.querySelector("ul");

  for (item of source_list) {
    const li = document.createElement("li");

    li.innerHTML = item;
    ul.appendChild(li);
  }
};

// 关键词改变时触发
const handleChange = (e) => {
  key_value = e.target.value.trim();

  highlight_list = [];
  for (item of source_list) {
    // 对每句内容根据关键词进行替换
    const slice_list = replaceString(item);
    highlight_list.push(slice_list);
  }

  renderHighlightList();
};

// 绑定监听器
const input = document.querySelector("input");
input.addEventListener("input", debounce(handleChange, 500));

// 初始列表渲染
renderSourceList();
