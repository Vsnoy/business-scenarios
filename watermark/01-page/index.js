// 生成水印画布
const createCanvas = () => {
  // 创建画布
  const canvas = document.createElement("canvas");
  // 设置画布宽高
  canvas.width = 200;
  canvas.height = 200;

  // 获取画布的绘制上下文
  const ctx = canvas.getContext("2d");
  // 颜色
  ctx.fillStyle = "#000";
  // 透明度
  ctx.globalAlpha = 1;
  // 字体
  ctx.font = "bold 20px serif";
  // 位移
  ctx.translate(50, 130);
  // 旋转
  ctx.rotate((-45 * Math.PI) / 180);
  // 水印文本
  ctx.fillText("薇尔莉特", 0, 0);

  return canvas;
};

// 渲染水印容器
const renderWatermark = () => {
  // 创建以画布为背景的容器，为了能够 repeat 批量铺满页面
  const container = document.createElement("div");
  // 获取生成的水印画布
  const canvas = createCanvas();
  // 将画布转为 base64 编码，repeat 平铺，作为容器的背景
  container.style.background = `url(${canvas.toDataURL()}) repeat`;
  // 容器固定定位，上下左右 0，铺满整个页面
  container.style.position = "fixed";
  container.style.left = 0;
  container.style.right = 0;
  container.style.top = 0;
  container.style.bottom = 0;
  // 容器层级设高点
  container.style.zIndex = "99999";
  // 容器遮盖在网页最上方，设置 pointer-events 防止其阻碍页面操作
  container.style.pointerEvents = "none";

  document.body.appendChild(container);
};

renderWatermark();
