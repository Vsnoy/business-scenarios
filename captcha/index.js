// 倒计时开始秒数
const TIME = 60;

// 文案
let str = "发送验证码";

// 倒计时
let time = TIME;

// 按钮是否可点击标记
let flag = true;

// 获取 button 实例
const button = document.querySelector("button");

// 点击发送验证码
const handleClick = () => {
  // 进入倒计时就不再可以点击了，防止生成多个 setInterval，导致倒计时加快
  if (!flag) return;
  flag = false;

  // 倒计时从60s就开始显示，而不是59s
  if (time === TIME) button.innerText = `${TIME}秒`;

  const interval = setInterval(() => {
    if (time > 0) {
      time--;
      button.innerText = `${time}秒`;
    } else {
      interval && clearInterval(interval);

      button.innerText = str;
      time = TIME;
      flag = true;
    }
  }, 1000);
};

button.innerText = str;

button.addEventListener("click", handleClick);
