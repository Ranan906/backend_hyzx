const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// ========== 中间件 ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 允许跨域（小程序开发时请求本机或局域网后端需放行；上线后若前后端同域可酌情移除）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 静态资源：上传的图片可通过 /uploads/xxx 访问（小程序请求时需拼上你的后端域名）
app.use('/uploads', express.static(uploadDir));

// 静态资源：轮播图图片可通过 /images/xxx 访问
const imagesDir = path.join(__dirname, '..', 'images');
app.use('/images', express.static(imagesDir));

// 配置 multer 用于图片上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ========== 模拟轮播图数据 ==========
let banners = [
  {
    id: '1',
    image: '/images/lunbo/lunbo_photo.png'
  },
  {
    id: '2',
    image: '/images/lunbo/lunbo_photo2.png'
  },
  {
    id: '3',
    image: '/images/lunbo/lunbo_photo3.png'
  }
];

// ========== 模拟商品数据（含 category 供前端分类筛选） ==========
let products = [
    {
    id: '1',
    name: '轮椅牵引头新芝云途X1运动轮椅牵引车头500瓦双油刹锂电池正品',
    price: 3980,
    category: '轮椅',
    images: [
      '/images/shop/chetou/yuntu.jpg',
      '/images/shop/chetou/yuntu2.jpg'
    ],
    description: '高性能折叠电动滑板车，集强劲动力、舒适减震与安全制动于一体，专为城市通勤与日常代步打造。\n整车搭载高功率电机系统，动力输出强劲稳定，起步迅速，加速顺畅，可轻松应对城市道路及缓坡路况。前后双重减震结构设计，有效缓冲路面颠簸，提升骑行舒适度，让长时间骑行也更加轻松。\n配备高灵敏油压碟刹系统，制动响应迅速，刹车稳定可靠，提升骑行安全性。宽胎设计增强抓地力与稳定性，适应多种路面环境。高清数显仪表可实时显示速度、电量、里程等信息，骑行状态清晰直观。\n采用便捷折叠结构设计，一键折叠，收纳方便，可轻松放入汽车后备箱或携带上楼，满足日常通勤与出行需求。\n适用于城市通勤、校园代步及短途出行，是兼顾性能、安全与便携性的理想选择。',
    specs: '电池：48V8A/20A 锂电池\n电机：10寸350瓦无刷无齿\n前叉：冲压一体成型前叉\n轮胎：真空胎\n控制器：双协议6管正弦波控制器\n似表：液晶仪表\n制动：油圧碟刹\n折叠：车把可折叠\n连接：铝合金精雕一秒快拆抱夹式运动连接\n支撑：铝合金支撑脚\n灯光：LED四光大灯/喇叭\n时速：25km/h（可解速）\n续航：续航40-100公里\n重量：整车重量18公斤，可拆重量13公斤\n功能：带倒车、霍而转把、三速调节'
  },
  {
    id: '2',
    name: '可调节铝合金拐杖 轻便防滑',
    price: 99,
    category: '拐杖',
    images: [
      '/images/shop/guaizhang/gz1_1.jpg',
      '/images/shop/guaizhang/gz1_2.jpg'
    ],
    description: '可调节高度的铝合金拐杖，轻便耐用，防滑设计，适合老年人和行动不便者使用。',
    specs: '材质：铝合金\n重量：0.5kg\n高度调节范围：70-95cm\n颜色：银色'
  },
  {
    id: '3',
    name: '助行器 老人辅助行走 带轮带座',
    price: 299,
    category: '助行器',
    images: [
      '/images/shop/zhuxingqi/zxq1_1.jpg',
      '/images/shop/zhuxingqi/zxq1_2.jpg'
    ],
    description: '带轮带座的助行器，方便老人休息，辅助行走，提高安全性。',
    specs: '材质：铝合金\n重量：5.2kg\n承重：150kg\n轮子：2个前轮，2个后轮\n颜色：白色'
  },
  {
    id: '4',
    name: '新芝新途轮椅车头改装前驱动轮椅牵引电动车头轮椅快拆折叠残疾车',
    price: 3680,
    category: '轮椅',
    images: [
      '/images/shop/chetou/xintu.jpg',
      '/images/shop/chetou/xintu2.jpg',
      '/images/shop/chetou/xintu3.jpg',
      '/images/shop/chetou/xintu4.jpg',
      '/images/shop/chetou/xintu5.jpg'
    ],
    description: '电动轮椅，智能操控，续航里程长，适合行动不便者使用。',
    specs: '材质：铝合金\n重量：25kg\n承重：120kg\n续航里程：20km\n颜色：蓝色'
  },
  {
    id: '5',
    name: '电动护理床 多功能家用 可升降',
    price: 3999,
    category: '护理床',
    images: [
      '/images/shop/hulichuang/hlc1_1.jpg',
      '/images/shop/hulichuang/hlc1_2.jpg'
    ],
    description: '多功能家用护理床，可升降，适合需要长期卧床的老人和病人使用。ABS气降大护栏，餐桌加高，双层加固框架，豪华大气',
    specs: '材质：钢管\n重量：80kg\n承重：200kg\n尺寸：2080*1060*560\n颜色：白色'
  },
  {
    id: '6',
    name: '浴室安全扶手 防滑不锈钢',
    price: 99,
    category: '无障碍设施',
    images: [
      '/images/shop/fushou/fs1_1.jpg',
      '/images/shop/fushou/fs1_2.jpg',
      '/images/shop/fushou/fs1_3.jpg',
    ],
    description: '浴室安全扶手，防滑不锈钢材质，适合老年人和行动不便者使用，提高浴室安全性。',
    specs: '材质：不锈钢\n重量：1.5kg\n长度：60cm\n颜色：黄色，白色'
  },
  {
    id: '7',
    name: '新芝征途轮椅驱动车头',
    price: 8500,
    category: '轮椅',
    images: [
      '/images/shop/chetou/zhengtu.jpg',
    ],
    description: '电动轮椅，智能操控，续航里程长，适合行动不便者使用。',
    specs: '材质：铝合金\n重量：25kg\n承重：120kg\n续航里程：20km\n颜色：蓝色'
  },
  {
    id: '8',
    name: '手工相册本 助残工艺',
    price: 18,
    category: '助残产品',
    images: [
      '/images/shop/zcproduct/nbook1_1.jpg',
      '/images/shop/zcproduct/nbook1_2.jpg',
      '/images/shop/zcproduct/nbook1_3.jpg',
    ],
    description: '由残疾人员工手工制作的相册本，采用优质纸张和环保材料，每一本都独一无二，记录美好回忆的同时支持助残事业。',
    specs: '材质：优质纸张、环保布料\n尺寸：18×24cm\n页数：40页\n颜色：多种颜色可选'
  },
  {
    id: '9',
    name: '手风琴折叠式空白封面diy相册',
    price: 12.9,
    category: '助残产品',
    images: [
      '/images/shop/zcproduct/nbook2_1.jpg',
      '/images/shop/zcproduct/nbook2_2.jpg',
      '/images/shop/zcproduct/nbook2_3.jpg',
    ],
    description: '由残疾人员工手工制作，采用天然材料，做工精细，实用美观，好而不贵，支持助残事业的同时为家居增添温馨气息。',
    specs: '材质：天然木材\n尺寸：25×20×3cm\n颜色：多种颜色可选'
  },
  {
    id: '10',
    name: '日记笔记本 复古牛皮本',
    price: 15,
    category: '助残产品',
    images: [
      '/images/shop/zcproduct/nbook3_1.jpg',
      '/images/shop/zcproduct/nbook3_2.jpg',
      '/images/shop/zcproduct/nbook3_3.jpg',
    ],
    description: '由残疾人员工手工打造，精致细节，小巧实用，支持助残事业的同时为生活增添小确幸。',
    specs: '材质：天然木材\n尺寸：5×3cm\n颜色：原木色\n图案：多种图案可选'
  },
];

// 二维码路径
let qrCodes = {
  telegroup: '/images/ewm/telegroup.jpg',  // 群聊二维码
  teleman: '/images/ewm/teleman.jpg'        // 个人微信二维码
};

// ========== 小程序/前端调用的 API 接口 ==========

/**
 * GET /api/products
 * 获取商品列表（小程序商城、首页主推等）
 * Query: category（可选）按分类筛选，如 ?category=轮椅
 * 返回: Array<{ id, name, price, category, image, description?, specs? }>
 */
app.get('/api/products', (req, res) => {
  const category = req.query.category;
  let list = products;
  if (category && category !== '全部') {
    list = products.filter(p => p.category === category);
  }
  res.json(list);
});

/**
 * GET /api/products/:id
 * 获取单个商品详情（小程序商品详情页）
 * 返回: { id, name, price, category, image, description, specs } 或 404
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: '商品不存在' });
  }
});

/**
 * POST /api/products
 * 添加新商品（管理端使用，支持图片上传）
 * Body: name, price, description?, specs?, imageUrl? 或 form-data 带 image 文件
 * 返回: 新商品对象
 */
app.post('/api/products', upload.single('image'), (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const newProduct = {
    id: Date.now().toString(),
    name: req.body.name,
    price: parseFloat(req.body.price),
    category: req.body.category || '其他',
    image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : req.body.imageUrl,
    description: req.body.description || '',
    specs: req.body.specs || ''
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * PUT /api/products/:id
 * 更新商品信息（管理端使用，支持换图）
 * Body: 同 POST，均为可选
 */
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: '商品不存在' });
  }
  const baseUrl = req.protocol + '://' + req.get('host');
  const updatedProduct = {
    ...products[productIndex],
    ...(req.body.name && { name: req.body.name }),
    ...(req.body.price != null && { price: parseFloat(req.body.price) }),
    ...(req.body.category != null && { category: req.body.category }),
    ...(req.file && { image: `${baseUrl}/uploads/${req.file.filename}` }),
    ...(req.body.imageUrl && { image: req.body.imageUrl }),
    ...(req.body.description != null && { description: req.body.description }),
    ...(req.body.specs != null && { specs: req.body.specs })
  };
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

/**
 * DELETE /api/products/:id
 * 删除商品（管理端使用）
 * 返回: { message: '商品删除成功' } 或 404
 */
app.delete('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.json({ message: '商品删除成功' });
  } else {
    res.status(404).json({ message: '商品不存在' });
  }
});

/**
 * GET /api/banners
 * 获取轮播图数据
 * 返回: Array<{ id, image }>
 */
app.get('/api/banners', (req, res) => {
  res.json(banners);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log('小程序请求时请将 utils/config.js 中 BASE_URL 设为该地址（真机调试用本机局域网 IP:3000）');
});

// 添加上传二维码接口
app.post('/api/qrcodes/:type', upload.single('image'), (req, res) => {
  const type = req.params.type;
  const baseUrl = req.protocol + '://' + req.get('host');
  
  if (req.file) {
    qrCodes[type] = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      url: qrCodes[type],
      message: '二维码上传成功' 
    });
  } else if (req.body.imageUrl) {
    qrCodes[type] = req.body.imageUrl;
    res.json({ 
      success: true, 
      url: qrCodes[type],
      message: '二维码链接更新成功' 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: '请提供图片文件或图片链接' 
    });
  }
});

// 添加获取二维码接口
app.get('/api/qrcodes/:type', (req, res) => {
  const type = req.params.type;
  const url = qrCodes[type];
  
  if (url) {
    const baseUrl = req.protocol + '://' + req.get('host');
    res.json({ 
      success: true, 
      url: url.startsWith('http') ? url : baseUrl + url 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: '二维码不存在' 
    });
  }
});