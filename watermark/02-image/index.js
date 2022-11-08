// 将图片绘制到画布上
const imgToCanvas = (source_img, canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source_img, 0, 0);
};

// 将水印绘制到画布上
const watermarkToCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.font = "30px 宋体";
  ctx.fillStyle = "#ffc82c";
  ctx.textAlign = "right";
  ctx.fillText("@violet", canvas.width - 50, canvas.height - 20);
};

const renderImgWatermark = () => {
  const container = document.querySelector(".container");

  // 将图片放到 img 标签内
  const old_img = document.createElement("img");
  old_img.setAttribute("crossOrigin", "anonymous");
  old_img.src = "https://s2.loli.net/2022/11/08/XHKjlEcCAvs2RBI.jpg";

  old_img.addEventListener("load", async () => {
    // 创建画布
    const canvas = document.createElement("canvas");
    canvas.width = old_img.width;
    canvas.height = old_img.height;

    // 将图片绘制到画布上
    imgToCanvas(old_img, canvas);

    // 将水印绘制到画布上
    watermarkToCanvas(canvas);

    // canvas 转 base64，赋给 img src 属性
    const new_img = document.createElement("img");
    new_img.src = canvas.toDataURL();
    new_img.width = 300;
    new_img.height = 300;
    container.appendChild(new_img);
  });
};

renderImgWatermark();
