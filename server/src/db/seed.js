import { db } from './connection.js';
import bcrypt from 'bcryptjs';

console.log('--- KHỞI TẠO BẢNG CƠ SỞ DỮ LIỆU DUYDENIM ---');

// Tạo các bảng
db.exec(`
  DROP TABLE IF EXISTS chitiet_hoadon;
  DROP TABLE IF EXISTS hoadon;
  DROP TABLE IF EXISTS hanghoa;
  DROP TABLE IF EXISTS admin;
  DROP TABLE IF EXISTS khachhang;
  DROP TABLE IF EXISTS loaihang;

  CREATE TABLE loaihang (
    id_loai INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_loai TEXT NOT NULL,
    mo_ta TEXT
  );

  CREATE TABLE hanghoa (
    id_hanghoa INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_hanghoa TEXT NOT NULL,
    gia REAL NOT NULL DEFAULT 0,
    gia_khuyen_mai REAL DEFAULT 0,
    hinh_anh TEXT,
    mo_ta TEXT,
    id_loai INTEGER,
    so_luong INTEGER DEFAULT 0,
    noi_bat INTEGER DEFAULT 0,
    ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_loai) REFERENCES loaihang(id_loai) ON DELETE SET NULL
  );

  CREATE TABLE khachhang (
    id_khachhang INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_khachhang TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    dien_thoai TEXT,
    dia_chi TEXT,
    ngay_dang_ky TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE hoadon (
    id_hoadon INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khachhang INTEGER NOT NULL,
    ngay_dat_hang TEXT DEFAULT CURRENT_TIMESTAMP,
    tong_tien REAL NOT NULL DEFAULT 0,
    trang_thai TEXT DEFAULT 'Chờ xác nhận',
    dia_chi_giao TEXT,
    sdt_giao TEXT,
    ghi_chu TEXT,
    FOREIGN KEY (id_khachhang) REFERENCES khachhang(id_khachhang) ON DELETE CASCADE
  );

  CREATE TABLE chitiet_hoadon (
    id_ct INTEGER PRIMARY KEY AUTOINCREMENT,
    id_hoadon INTEGER NOT NULL,
    id_hanghoa INTEGER,
    ten_hanghoa TEXT,
    so_luong INTEGER NOT NULL DEFAULT 1,
    don_gia REAL NOT NULL DEFAULT 0,
    size TEXT DEFAULT 'M',
    FOREIGN KEY (id_hoadon) REFERENCES hoadon(id_hoadon) ON DELETE CASCADE
  );

  CREATE TABLE admin (
    id_admin INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    ten_hien_thi TEXT,
    ngay_tao TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('--- NẠP TOÀN BỘ DANH MỤC THỜI TRANG ĐẦY ĐỦ CHUẨN ICONDENIM ---');

// Thêm loại hàng
const insertLoai = db.prepare('INSERT INTO loaihang (ten_loai, mo_ta) VALUES (?, ?)');
const categories = [
  ['Quần Jeans & Denim', 'Quần jeans nam cao cấp Smart Jeans™, ICON105 Lightweight™ co giãn 4 chiều'],
  ['Áo Polo Nam', 'Áo polo nam công nghệ dệt ProCOOL++™ mát lạnh, chống nhăn, giữ form'],
  ['Áo Thun & Ba Lỗ', 'Áo thun Compact Cotton 100%, tank top thể thao, graphic Marvel & Disney'],
  ['Áo Khoác, Hoodie & Nỉ Len', 'Áo khoác denim trucker, hoodie streetwear, áo len dệt kim và áo nỉ sweater'],
  ['Áo Sơ Mi Nam', 'Sơ mi denim stonewash, sơ mi sợi tre Bamboo & Oxford công sở thanh lịch'],
  ['Quần Tây, Kaki & Jogger', 'Quần tây smart trousers lưng thun ẩn, quần kaki chino và jogger thể thao'],
  ['Giày Dép, Balo & Túi', 'Giày sneaker da, dép quai ngang đúc, balo laptop và túi đeo chéo canvas'],
  ['Phụ Kiện, Nón, Thắt Lưng & Kính', 'Thắt lưng da bò, nón denim washed, vớ nano kháng khuẩn và mắt kính UV400'],
  ['Set Đồ & Quần Boxer', 'Set đồ bộ thể thao nam và quần lót boxer kháng khuẩn thoáng mát']
];

for (const cat of categories) {
  insertLoai.run(...cat);
}

console.log('--- NẠP FULL CÁC SẢN PHẨM KHỚP 100% VỚI MENU SẢN PHẨM ---');

const insertHangHoa = db.prepare(`
  INSERT INTO hanghoa (ten_hanghoa, gia, gia_khuyen_mai, hinh_anh, mo_ta, id_loai, so_luong, noi_bat)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const products = [
  // ==========================================
  // PHẦN 1: ÁO NAM
  // ==========================================

  // --- 1.1 ÁO THUN (Cat 3) ---
  [
    'Áo Thun Nam 100% Cotton Compact Chống Nhăn Trắng',
    220000, 179000,
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
    'Áo thun basic màu trắng tinh khôi từ sợi bông tự nhiên Compact dài sợi, bề mặt láng mịn, thấm hút mồ hôi 100% và giữ form cổ phẳng phiu.',
    3, 200, 1
  ],
  [
    'Áo Thun Nam 100% Cotton Compact Chống Nhăn Đen',
    220000, 179000,
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop',
    'Mẫu áo thun đen basic không thể thiếu trong tủ đồ mọi chàng trai, công nghệ dệt chống phai màu và kháng khuẩn tự nhiên.',
    3, 180, 1
  ],
  [
    'Áo Thun Nam Typography "ENJOY LIFE" Signature',
    290000, 239000,
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    'Dòng áo thun mang tinh thần slogan Enjoy Life của Icon Denim, in lụa cao cấp sắc nét, độ bền màu tuyệt đối qua hàng trăm lần giặt.',
    3, 130, 1
  ],
  [
    'Áo Thun Nam Marvel Collab Spider-Man Bản Quyền',
    350000, 299000,
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop',
    'Bộ sưu tập hợp tác bản quyền chính hãng Marvel, đồ họa Người Nhện phong cách streetwear cá tính, chất thun co giãn 4 chiều.',
    3, 85, 1
  ],
  [
    'Áo Thun Nam Disney Mickey & Friends Streetwear',
    340000, 289000,
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    'Bản quyền chính thức từ Disney, họa tiết vẽ tay độc đáo phong cách retro vintage hoài niệm, tạo nét trẻ trung phá cách.',
    3, 60, 0
  ],
  [
    'Áo Thun Nam Garfield Graphic Hài Hước Trẻ Trung',
    320000, 0,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=600&fit=crop',
    'Áo phông in hình chú mèo Garfield lười biếng dễ thương, chất thun cotton co giãn mát lạnh, là điểm nhấn nổi bật khi đi dạo phố.',
    3, 50, 0
  ],

  // --- 1.2 ÁO POLO (Cat 2) ---
  [
    'Áo Polo Nam ProCOOL++™ Dệt Tổ Ong Mát Lạnh',
    350000, 289000,
    'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600&h=600&fit=crop',
    'Áo polo ứng dụng công nghệ sợi ProCOOL++ siêu mát, cấu trúc dệt tổ ong thoát nhiệt tức thì, kháng khuẩn khử mùi vượt trội.',
    2, 150, 1
  ],
  [
    'Áo Polo Nam Phối Cổ Dệt Bo Viền Smart Casual',
    380000, 320000,
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=600&fit=crop',
    'Áo polo phong cách smart-casual lịch lãm, viền cổ dệt jacquard cao cấp tinh tế, phù hợp cho cả đi làm công sở lẫn gặp đối tác.',
    2, 90, 1
  ],
  [
    'Áo Polo Nam Cotton Pique Trơn Thêu Logo Tinh Tế',
    320000, 0,
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop',
    'Chất vải cá sấu Cotton Pique dày dặn nhưng vô cùng thoáng mát, thêu logo chữ ký nhỏ tinh tế ở ngực áo, không xù lông.',
    2, 75, 0
  ],
  [
    'Áo Polo Nam Cổ Zip Khóa Kéo Kim Loại Hiện Đại',
    390000, 339000,
    'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&h=600&fit=crop',
    'Thiết kế cổ kéo khóa zip kim loại chống rỉ sang trọng, phom Regular Fit tôn bờ vai và ngực nam giới, tạo phong cách khỏe khoắn.',
    2, 65, 1
  ],

  // --- 1.3 ÁO SƠ MI (Cat 5) ---
  [
    'Áo Sơ Mi Nam Denim Dài Tay Rửa Màu Stonewash',
    420000, 359000,
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
    'Áo sơ mi vải denim mỏng nhẹ mềm mịn, kỹ thuật rửa màu stonewash tạo độ sờn tự nhiên, tôn nét quyến rũ lịch lãm cho phái mạnh.',
    5, 75, 1
  ],
  [
    'Áo Sơ Mi Nam Oxford Dài Tay Chống Nhăn Trắng',
    380000, 319000,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
    'Áo sơ mi Oxford chất vải dệt hạt mè chống nhăn tuyệt hảo, phom dáng chuẩn phù hợp cả nơi công sở chỉn chu lẫn các buổi tiệc tùng.',
    5, 100, 1
  ],
  [
    'Áo Sơ Mi Nam Sợi Tre Bamboo Kháng Khuẩn Xanh Nhạt',
    410000, 349000,
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop',
    'Chất liệu sợi tre sinh học siêu mềm mượt, khả năng tự điều hòa thân nhiệt, thấm hút gấp 3 lần cotton thông thường.',
    5, 60, 0
  ],
  [
    'Áo Sơ Mi Nam Ngắn Tay Cổ Trụ Phối Túi Nắp Hè',
    350000, 0,
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=600&fit=crop',
    'Thiết kế cổ trụ trẻ trung phóng khoáng, form rộng thoải mái cho những buổi dạo biển hay cafe gặp gỡ bạn bè cuối tuần.',
    5, 50, 0
  ],

  // --- 1.4 ÁO KHOÁC (Cat 4) ---
  [
    'Áo Khoác Denim Nam Trucker Classic Xanh Indigo',
    620000, 529000,
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop',
    'Mẫu áo khoác denim trucker kinh điển của Icon Denim, khuy đồng đúc dập nổi sắc nét, wash màu xanh indigo nam tính.',
    4, 45, 1
  ],
  [
    'Áo Khoác Jean Nam Oversize Phong Cách Đường Phố',
    650000, 550000,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
    'Áo khoác jean form rộng phong cách Hàn Quốc, có túi trong tiện dụng, vải dệt dày dặn chống nắng gắt và cản gió lạnh hiệu quả.',
    4, 40, 1
  ],
  [
    'Áo Khoác Bomber Kaki Phối Denim Khóa Kéo Hai Chiều',
    580000, 489000,
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&h=600&fit=crop',
    'Sự kết hợp độc đáo giữa chất vải Kaki trượt nước và chi tiết cổ bo denim cao cấp, phong cách thể thao mạnh mẽ.',
    4, 55, 0
  ],
  [
    'Áo Khoác Gió Nam ProCOOL Kháng Nước Chống Tia UV',
    450000, 379000,
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=600&fit=crop',
    'Áo khoác gió siêu nhẹ gấp gọn vào túi, phủ lớp DWR kháng nước mưa phùn và cản nắng tiêu chuẩn UPF 50+.',
    4, 90, 1
  ],

  // --- 1.5 ÁO NỈ VÀ LEN (Cat 4) ---
  [
    'Áo Nỉ Nam Chui Đầu Sweater Trơn Basic Form Rộng',
    380000, 319000,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop',
    'Áo nỉ sweater form rộng tay bo chun, nỉ bông chân cua giữ nhiệt tốt, mềm mại, dễ phối cùng sơ mi mặc bên trong.',
    4, 65, 1
  ],
  [
    'Áo Len Nam Dệt Kim Cổ Tròn Họa Tiết Bắc Âu Retro',
    420000, 359000,
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop',
    'Áo len nam chất liệu len dệt kim mềm mịn, không gây ngứa ráp, giữ ấm cơ thể tuyệt hảo trong những ngày se lạnh.',
    4, 50, 0
  ],

  // --- 1.6 HOODIE (Cat 4) ---
  [
    'Áo Hoodie Nam Có Mũ Nỉ Bông Dày Dặn Streetwear',
    450000, 389000,
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop',
    'Áo hoodie nỉ bông cao cấp có mũ dây rút tiện lợi, túi kangaroo phía trước giữ ấm tay, phong cách cá tính.',
    4, 80, 1
  ],
  [
    'Áo Hoodie Zip Khóa Kéo Thêu Chữ Nổi Iconic',
    480000, 399000,
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=600&fit=crop',
    'Áo khoác hoodie kéo khóa tiện lợi mở đóng, vải nỉ chần bông co giãn, thêu nổi logo thương hiệu đẳng cấp.',
    4, 70, 0
  ],

  // --- 1.7 TANK TOP - ÁO BA LỖ (Cat 3) ---
  [
    'Áo Tank Top Nam - Áo Ba Lỗ Thể Thao ProCOOL Tập Gym',
    190000, 149000,
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop',
    'Áo tank top ba lỗ nam chuyên dụng tập gym, thể thao, vải lưới siêu nhẹ làm mát ProCOOL++ thoát nhiệt tức thì.',
    3, 110, 1
  ],
  [
    'Áo Ba Lỗ Nam Cotton 100% Thoáng Khí Mát Mẻ Mùa Hè',
    160000, 129000,
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    'Áo ba lỗ nam chất liệu 100% cotton tự nhiên mềm mại, thấm hút mồ hôi tối đa, thích hợp mặc lót hoặc mặc nhà.',
    3, 90, 0
  ],

  // --- 1.8 SET ĐỒ (ÁO & QUẦN) (Cat 9) ---
  [
    'Set Đồ Nam Thể Thao Mùa Hè Áo Thun + Quần Short ProCOOL',
    490000, 399000,
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=600&fit=crop',
    'Set đồ bộ nam thể thao gồm áo thun và quần short đồng bộ chất vải ProCOOL++ mát lạnh, phối viền năng động.',
    9, 60, 1
  ],
  [
    'Set Đồ Bộ Nam Nỉ Thu Đông Cao Cấp Hoodie & Jogger',
    690000, 589000,
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=600&fit=crop',
    'Set đồ bộ nỉ dày dặn ấm áp gồm áo hoodie có mũ và quần jogger bo gấu, chuẩn phong cách streetwear mùa đông.',
    9, 45, 1
  ],

  // ==========================================
  // PHẦN 2: QUẦN NAM
  // ==========================================

  // --- 2.1 QUẦN JEAN (Cat 1) ---
  [
    'Quần Jean Nam Smart Jeans™ Slim-fit Co Giãn Siêu Thoáng',
    450000, 389000,
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=600&fit=crop',
    'Dòng Smart Jeans™ độc quyền với công nghệ sợi co giãn 4 chiều, giữ form ôm gọn gàng, thấm hút mồ hôi tối đa.',
    1, 120, 1
  ],
  [
    'Quần Jean Nam ICON105 Lightweight™ Siêu Nhẹ 320g',
    480000, 420000,
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop',
    'Dòng ICON105 siêu nhẹ chỉ 320g, chất vải denim wash cao cấp mềm mát cho mùa hè, không bai nhão và luôn bền màu.',
    1, 85, 1
  ],
  [
    'Quần Jean Nam Regular Fit Rách Xước Cá Tính Streetwear',
    420000, 350000,
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop',
    'Quần jean form Regular thoải mái với các chi tiết mài rách thủ công sắc nét, phong cách bụi bặm đường phố.',
    1, 60, 0
  ],
  [
    'Quần Jean Nam Dáng Suông Baggy Denim Xanh Vintage',
    490000, 399000,
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=600&fit=crop',
    'Thiết kế dáng ống rộng Baggy hot trend, màu xanh vintage wash mờ thời thượng, cực kỳ dễ phối cùng áo phông oversize.',
    1, 95, 1
  ],
  [
    'Quần Jean Nam Tapered Fit Wash Xám Tro Hiện Đại',
    460000, 0,
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&h=600&fit=crop',
    'Quần jean màu xám khói wash đá độc đáo, form Tapered ôm nhẹ từ đùi xuống gấu giúp đôi chân trông thon dài.',
    1, 70, 0
  ],

  // --- 2.2 QUẦN SHORT (Cat 1 & 6) ---
  [
    'Quần Short Jean Nam Denim Rách Gấu Mùa Hè',
    320000, 269000,
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop',
    'Quần short jean trẻ trung năng động, chất denim co giãn nhẹ thoải mái cho các chuyến du lịch, dạo phố.',
    1, 110, 1
  ],
  [
    'Quần Short Kaki Nam Đi Chơi Dạo Phố Thoải Mái Đen',
    280000, 229000,
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=600&fit=crop',
    'Quần short kaki dài trên gối hiện đại, lưng thun rút dây tiện lợi, màu đen cá tính dễ phối đồ với mọi loại áo.',
    6, 110, 0
  ],
  [
    'Quần Short Thể Thao Nam Dù Gió 2 Lớp Chạy Bộ Tập Gym',
    260000, 199000,
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
    'Quần short dù thể thao có lót trong co giãn chống ma sát, cản gió kháng nước nhẹ, thích hợp chạy bộ và tập gym.',
    6, 95, 0
  ],

  // --- 2.3 QUẦN KAKI & CHINO (Cat 6) ---
  [
    'Quần Kaki Nam Co Giãn Form Tapered Lịch Lãm Be',
    420000, 349000,
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop',
    'Quần kaki màu be thanh lịch, pha sợi Spandex co giãn đàn hồi tốt, mặc cả ngày làm việc vẫn rất êm ái.',
    6, 80, 1
  ],
  [
    'Quần Dài Chino Nam Co Giãn Màu Rêu Phong Cách Casual',
    430000, 369000,
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop',
    'Quần chino màu xanh rêu thời trang, chất vải dệt chéo mịn màng chống nhăn, phom dáng ôm vừa vặn chuẩn soái ca.',
    6, 70, 0
  ],

  // --- 2.4 QUẦN JOGGER - QUẦN DÀI (Cat 6) ---
  [
    'Quần Jogger Nam Vải Nỉ Cotton Thể Thao Năng Động',
    360000, 299000,
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=600&fit=crop',
    'Quần jogger bo gấu thể thao, chất nỉ cotton chân cua thoáng khí thấm mồ hôi tốt, thích hợp đi tập gym hay mặc nhà.',
    6, 90, 0
  ],
  [
    'Quần Dài Nam Túi Hộp Cargo Pants Phong Cách Chiến Thuật',
    450000, 389000,
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&h=600&fit=crop',
    'Quần dài túi hộp phong cách lính cá tính, nhiều ngăn tiện lợi, chất vải kaki dệt mật độ cao chống rách xước.',
    6, 65, 1
  ],

  // --- 2.5 QUẦN TÂY (Cat 6) ---
  [
    'Quần Tây Nam Smart Trousers Lưng Chun Ẩn Co Giãn',
    460000, 389000,
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop',
    'Quần tây đột phá với cạp chun ẩn 2 bên hông tự co giãn theo vòng eo, chất vải chống nhăn đứng form hoàn hảo.',
    6, 70, 1
  ],
  [
    'Quần Tây Nam Dáng Ôm Xếp Ly Chuẩn Phong Cách Công Sở',
    480000, 399000,
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&h=600&fit=crop',
    'Quần tây âu công sở có ly trước lịch lãm, chất vải tuyết mưa cao cấp co giãn nhẹ, giữ nếp ly sắc nét sau khi giặt.',
    6, 60, 0
  ],

  // --- 2.6 QUẦN BOXER (ĐỒ LÓT) (Cat 9) ---
  [
    'Set 3 Quần Boxer Nam Cotton Kháng Khuẩn Thoáng Mát',
    240000, 189000,
    'https://images.pexels.com/photos/5698856/pexels-photo-5698856.jpeg?w=600&h=600&fit=crop',
    'Hộp 3 quần lót boxer nam sợi bông cotton hữu cơ mềm mại, cạp chun êm ái không để lại vết hằn trên da.',
    9, 130, 1
  ],
  [
    'Quần Boxer Nam Vải Modal Sợi Gỗ Sồi Co Giãn 4 Chiều',
    110000, 89000,
    'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?w=600&h=600&fit=crop',
    'Quần lót nam vải modal siêu mềm mượt như lụa, thấm hút mồ hôi gấp đôi cotton, kháng khuẩn ion bạc ngăn mùi.',
    9, 150, 0
  ],

  // ==========================================
  // PHẦN 3: GIÀY & PHỤ KIỆN
  // ==========================================

  // --- 3.1 GIÀY & DÉP (Cat 7) ---
  [
    'Giày Sneaker Nam Da Trắng Cổ Thấp Minimalist',
    550000, 459000,
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
    'Giày sneaker trắng da vi sợi cao cấp, đế cao su nguyên khối chống trơn trượt, lót đệm êm chân suốt cả ngày dài.',
    7, 50, 1
  ],
  [
    'Dép Quai Ngang Nam - Giày Dép Đế Đúc Đi Mưa Êm Chân',
    250000, 189000,
    'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop',
    'Dép quai ngang đúc nguyên khối chống nước, siêu nhẹ, đế lượn sóng ma sát tốt, thích hợp đi dạo phố hay du lịch biển.',
    7, 85, 0
  ],

  // --- 3.2 BALO, TÚI & VÍ (Cat 7) ---
  [
    'Balo Nam Đa Năng - Túi Đựng Laptop 15.6 Inch Chống Nước',
    490000, 399000,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    'Balo thời trang đựng vừa laptop 15.6 inch, có cổng sạc USB tiện dụng, vải oxford chống thấm nước và chống rạch xước.',
    7, 70, 1
  ],
  [
    'Ví Da Nam Dáng Ngang Mini Chống Trộm Sóng RFID',
    260000, 199000,
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    'Ví da nam nhỏ gọn tích hợp màng chắn sóng điện từ RFID bảo vệ thẻ ngân hàng, đường chỉ may viền thủ công tỉ mỉ.',
    7, 80, 0
  ],
  [
    'Túi Đeo Chéo Canvas Chống Nước Phối Khóa Bấm Streetwear',
    320000, 259000,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    'Túi đeo chéo đựng vừa iPad và các vật dụng cá nhân, vải canvas dày dặn có phủ lớp chống thấm nước mưa.',
    7, 65, 1
  ],

  // --- 3.3 NÓN (Cat 8) ---
  [
    'Nón Lưỡi Trai Denim Washed Thêu Chữ Nổi Enjoy Life',
    190000, 149000,
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    'Mũ lưỡi trai chất liệu denim wash bụi bặm, thêu nổi 3D thông điệp Enjoy Life sắc nét, có khóa chỉnh kích thước.',
    8, 140, 1
  ],
  [
    'Nón Bucket Nam Vành Tròn Phong Cách Dạo Phố Streetwear',
    220000, 169000,
    'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&h=600&fit=crop',
    'Nón tai bèo bucket vành tròn vải kaki 2 lớp chống nắng hiệu quả, thiết kế trẻ trung phù hợp đi phượt và du lịch.',
    8, 90, 0
  ],

  // --- 3.4 THẮT LƯNG (Cat 8) ---
  [
    'Thắt Lưng Da Nam Khóa Kim Loại Vintage Icon Denim',
    290000, 239000,
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=600&fit=crop',
    'Da bò nguyên tấm nhập khẩu, mặt khóa hợp kim nguyên khối chống xước, tạo điểm nhấn nam tính khi mặc cùng jeans.',
    8, 95, 1
  ],
  [
    'Thắt Lưng Vải Dù Dệt Khóa Tự Động Thể Thao Nam',
    180000, 139000,
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=600&fit=crop',
    'Dây lưng vải dù dệt bền chắc, khóa tự động kim loại bấm tháo mở nhanh 1 giây, cực kỳ tiện dụng cho quần jean và kaki.',
    8, 80, 0
  ],

  // --- 3.5 VỚ (TẤT) (Cat 8) ---
  [
    'Hộp 5 Đôi Vớ Cổ Ngắn Nam Khử Mùi Kháng Khuẩn Nano Bạc',
    150000, 119000,
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    'Hộp 5 đôi vớ cổ ngắn dệt cotton kháng khuẩn ion bạc ngăn mùi hôi chân, có gờ silicon chống tuột gót khi mang giày lười.',
    8, 120, 1
  ],
  [
    'Set 3 Đôi Tất Cổ Trung Nam - Vớ Dệt Gân Cotton Thể Thao',
    120000, 89000,
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    'Tất vớ cổ trung dệt gân phong cách thể thao sành điệu, chất cotton thấm hút tốt, bảo vệ mắt cá chân êm ái.',
    8, 100, 0
  ],

  // --- 3.6 MẮT KÍNH (Cat 8) ---
  [
    'Mắt Kính Mát Nam Chống Tia UV400 Gọng Kim Loại Aviator Phi Công',
    290000, 229000,
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
    'Kính phi công Aviator kinh điển, tròng phân cực Polarized chống lóa mắt khi lái xe ban ngày, bảo vệ 100% tia UV400.',
    8, 75, 1
  ],
  [
    'Mắt Kính Thời Trang Nam Mắt Vuông Đen Phong Cách Hàn Quốc',
    260000, 199000,
    'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop',
    'Kính mát nam gọng vuông thời thượng, tôn nét góc cạnh nam tính cho khuôn mặt, bảo vệ mắt khỏi bụi bẩn khi đi đường.',
    8, 85, 0
  ]
];

for (const p of products) {
  insertHangHoa.run(...p);
}

// Thêm tài khoản Admin và tài khoản Khách hàng thử nghiệm
const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);

const insertAdmin = db.prepare('INSERT INTO admin (username, password, ten_hien_thi) VALUES (?, ?, ?)');
insertAdmin.run('admin1', hashPassword('admin123'), 'Quản Trị Viên');

const insertUser = db.prepare(`
  INSERT INTO khachhang (ten_khachhang, email, password, dien_thoai, dia_chi)
  VALUES (?, ?, ?, ?, ?)
`);
insertUser.run('Duy Lê', 'user@gmail.com', hashPassword('123456'), '0987654321', 'TP. Hồ Chí Minh');

console.log(`✅ Khởi tạo và nạp thành công ${categories.length} danh mục & ${products.length} sản phẩm đầy đủ chuẩn ICON DENIM!`);
