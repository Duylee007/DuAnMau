import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award, Users, MapPin, Truck, RefreshCw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function AboutUs({ onBackToShop }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
      
      {/* 1. HERO BANNER ABOUT */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '4rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: '#0f172a',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}
        >
          <Sparkles size={14} color="#f59e0b" />
          VỀ THƯƠNG HIỆU DUYDENIM • ENJOY LIFE
        </span>

        <h1
          style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            letterSpacing: '-0.5px'
          }}
        >
          Định Hình Phong Cách Thời Trang Nam <br />
          <span style={{ color: '#1d4ed8' }}>Trẻ Trung & Hiện Đại</span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            maxWidth: '750px',
            margin: '0 auto 2rem',
            lineHeight: 1.7
          }}
        >
          DUYDENIM ra đời với sứ mệnh mang đến cho nam giới Việt Nam những sản phẩm thời trang vừa vặn hoàn hảo, kết hợp giữa phong cách streetwear thời thượng, sự thoải mái tối đa và công nghệ sợi vải tiên tiến nhất.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onBackToShop} style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
            Khám phá sản phẩm ngay <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 2. CÂU CHUYỆN THƯƠNG HIỆU (BRAND STORY) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '4.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            CÂU CHUYỆN CỦA CHÚNG TÔI
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.6rem 0 1.25rem', lineHeight: 1.3 }}>
            Thời Trang Là Để <br /> Tận Hưởng Cuộc Sống (Enjoy Life)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '1.2rem' }}>
            Chúng tôi tin rằng trang phục hàng ngày không nên là sự gò bó hay đánh đổi giữa đẹp mắt và dễ chịu. Từng chiếc quần jean, áo polo, hay áo thun của DUYDENIM đều được nghiên cứu chuyên sâu dựa trên đặc tính vóc dáng và thói quen sinh hoạt của nam giới Việt.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            Với tinh thần <strong>"Enjoy Life"</strong>, mỗi thiết kế giúp bạn tự tin thể hiện cá tính riêng, sẵn sàng làm chủ mọi tình huống: từ không gian làm việc năng động, buổi gặp gỡ bạn bè đến các chuyến dã ngoại cuối tuần.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1d4ed8' }}>50,000+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Khách hàng tin tưởng</div>
            </div>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800, fontSize: '1.6rem', color: '#059669' }}>98.5%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đánh giá hài lòng 5 sao</div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
            alt="DUYDENIM Workshop & Lifestyle"
            style={{
              width: '100%',
              borderRadius: '20px',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.12)',
              objectFit: 'cover'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: '#ffffff',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Award size={28} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Chuẩn Form Dáng Việt</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nghiên cứu & Đo đạc chuẩn mực</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CÔNG NGHỆ CHẤT LIỆU ĐỘT PHÁ (INNOVATIONS) */}
      <div style={{ marginBottom: '4.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            CHẤT LƯỢNG TIÊN PHONG
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
            Công Nghệ Chất Liệu Đột Phá
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Chúng tôi không ngừng nghiên cứu và ứng dụng các công nghệ dệt may tân tiến nhằm tạo nên những sản phẩm chất lượng cao nhất.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '2rem 1.75rem',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.25s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Zap size={24} color="#1d4ed8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              Smart Jeans™ Co Giãn 4 Chiều
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Công nghệ sợi bọc Spandex đàn hồi cao cấp, giúp quần jeans vừa vặn ôm cơ thể nhưng vẫn linh hoạt tối đa khi di chuyển, đứng lên ngồi xuống mà không hề gò bó.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '2rem 1.75rem',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.25s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Sparkles size={24} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              ProCOOL++™ Siêu Thoáng Mát
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Cấu trúc dệt tổ ong thoát ẩm và tản nhiệt tức thì, giúp bề mặt vải luôn mát lạnh khi chạm vào. Khả năng kháng khuẩn khử mùi tự nhiên, cực kỳ phù hợp khí hậu Việt Nam.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '2rem 1.75rem',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.25s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              100% Cotton Compact Chống Nhăn
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Bông sợi tự nhiên dài cao cấp được chải kỹ nhằm loại bỏ sợi ngắn, hạn chế tối đa xù lông, bề mặt vải láng mịn và giữ nguyên độ phẳng phiu sau nhiều lần giặt sấy.
            </p>
          </div>
        </div>
      </div>

      {/* 4. TẦM NHÌN & GIÁ TRỊ CỐT LÕI */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '3rem 2.5rem',
          marginBottom: '4.5rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>TẦM NHÌN</span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.8rem' }}>
              Dẫn Đầu Xu Hướng Thời Trang Trẻ
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Trở thành thương hiệu thời trang nam ứng dụng hàng đầu tại Việt Nam, mang đến giải pháp phong cách toàn diện giúp giới trẻ tự tin khẳng định bản thân và nâng tầm diện mạo.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>SỨ MỆNH</span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.8rem' }}>
              Tôn Vinh Vẻ Đẹp Nam Giới Việt
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Cung cấp các sản phẩm may đo chất lượng cao với mức giá hợp lý, đồng hành cùng khách hàng trong mọi khoảnh khắc thường nhật với chất lượng dịch vụ tận tâm nhất.
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>GIÁ TRỊ CỐT LÕI</span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.8rem' }}>
              Chân Thành & Trách Nhiệm
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              Lấy sự hài lòng của khách hàng làm thước đo cao nhất. Luôn lắng nghe, cải tiến quy trình và cam kết dịch vụ đổi trả minh bạch, tiện lợi tận nhà.
            </p>
          </div>
        </div>
      </div>

      {/* 5. HỆ THỐNG CỬA HÀNG SHOWROOM */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            HỆ THỐNG TRẢI NGHIỆM
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
            Mạng Lưới Showroom Toàn Quốc
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              <MapPin size={18} color="#1d4ed8" /> Chi Nhánh TP. Hồ Chí Minh
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              • 261 Quang Trung, P.10, Gò Vấp <br />
              • Tầng 2, TTTM Aeon Mall Tân Phú
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              <MapPin size={18} color="#1d4ed8" /> Chi Nhánh Hà Nội
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              • 12 Hàng Gai, Q. Hoàn Kiếm <br />
              • 175 Cầu Giấy, Q. Cầu Giấy
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              <MapPin size={18} color="#1d4ed8" /> Chi Nhánh Đà Nẵng
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              • 45 Lê Duẩn, Q. Hải Châu <br />
              • Mở cửa: 08:30 - 22:00 hàng ngày
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              <Truck size={18} color="#059669" /> Đặt Hàng Trực Tuyến
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              • Giao hàng hỏa tốc 2H tại TP.HCM <br />
              • Miễn phí vận chuyển toàn quốc từ 499K
            </p>
          </div>
        </div>
      </div>

      {/* 6. CALL TO ACTION FOOTER OF ABOUT */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#ffffff'
        }}
      >
        <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Sẵn Sàng Nâng Tầm Phong Cách Cùng DUYDENIM?
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 2rem' }}>
          Khám phá ngay bộ sưu tập mới nhất với ưu đãi hấp dẫn và chính sách đổi hàng 15 ngày tận nơi.
        </p>
        <button
          onClick={onBackToShop}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            padding: '0.85rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          Mua sắm ngay bây giờ <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}

