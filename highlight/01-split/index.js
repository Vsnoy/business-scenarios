// 关键词
let key_value = "";

// 原内容数组
const source_list = ["你好鸭", "今天天气真好", "又到了白色相簿的季节了"];

// 根据高亮关键词拆分后的二维数组
let highlight_list = [];

// 防抖
const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

// 以关键词为界，拆分字符串
const splitString = (item) => {
  const reg = new RegExp(`(${key_value})`, "g");
  return item.split(reg);
};

// 渲染高亮列表
const renderHighlightList = () => {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  for (slice_list of highlight_list) {
    const li = document.createElement("li");

    const content = slice_list.reduce((pre, cur) => {
      if (cur === key_value) {
        pre += `<span style="color: red">${cur}</span>`;
      } else {
        pre += cur;
      }

      return pre;
    }, "");

    li.innerHTML = content;
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
    // 对每句内容根据关键词进行分片，过滤掉空切片
    const slice_list = splitString(item).filter(Boolean);
    highlight_list.push(slice_list);
  }

  renderHighlightList();
};

// 绑定监听器
const input = document.querySelector("input");
input.addEventListener("input", debounce(handleChange, 500));

// 初始列表渲染
renderSourceList();
