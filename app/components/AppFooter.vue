<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-col footer-col--mission">
        <h3>服務宗旨</h3>
        <p>用心守護每個毛孩子的健康與幸福</p>
      </div>

      <div class="footer-col footer-col--social">
        <h3>官方社群</h3>
        <p>追蹤我們獲得最新資訊</p>
        <div class="social-icons">
          <a
            href="https://www.facebook.com/PusinAH034315700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="@/assets/image/Vector (2).png" alt="Facebook" />
          </a>
          <a
            href="https://line.me/R/ti/p/@316zsgcf?ts=07021638&oat_content=url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="@/assets/image/Vector (3).png" alt="Line" />
          </a>
        </div>
      </div>

      <div class="footer-col footer-col--contact">
        <h3>聯絡資訊</h3>
        <ul>
          <li>
            <img src="@/assets/image/Vector (4).png" alt="電話" class="icon" />
            <span>電話:(03) 431-5700</span>
          </li>
          <li>
            <img src="@/assets/image/Vector (5).png" alt="地址" class="icon" />
            <span>地址:桃園市楊梅區永美路274號</span>
          </li>
          <li>
            <img src="@/assets/image/Vector (6).png" alt="營業時間" class="icon" />
            <span>
              營業時間:週一至週日<br />
              早診 09:00-11:40<br />
              午診 13:00-16:40<br />
              晚診 18:00-20:40
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2026 人人動物醫院埔心分院 版權所有</p>
      <p>Design by 彩虹小馬工作室</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
}
</script>

<style scoped>
.footer {
  position: relative;
  z-index: 10;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 0;
  background: #143c64;
  color: #fff;
  padding:
    clamp(36px, 6vw, 64px)
    clamp(18px, 5vw, 72px)
    clamp(18px, 3vw, 34px);
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}

/* ── 主要內容區 ── */
.footer-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(30px, 6vw, 52px);
  width: min(100%, 1240px);
  margin: 0 auto;
}

/* ── 每欄 ── */
.footer-col {
  text-align: center;
  min-width: 0;
}

.footer-col h3 {
  position: relative;
  display: inline-block;
  margin: 0 0 clamp(14px, 2vw, 20px);
  padding-bottom: 8px;
  font-size: clamp(18px, 2vw, 23px);
  font-weight: 700;
  color: #fff;
}

.footer-col h3::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 34px;
  height: 2px;
  content: '';
  background: #78c9df;
  border-radius: 999px;
  transform: translateX(-50%);
}

.footer-col p {
  max-width: 34ch;
  margin: 0 auto;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.75;
  overflow-wrap: anywhere;
  opacity: 0.95;
}

/* ── 聯絡清單 ── */
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  max-width: 340px;
  margin: 0 auto clamp(10px, 1.2vw, 14px);
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.7;
  text-align: left;
}

.footer-col ul li:last-child {
  margin-bottom: 0;
}

.footer-col ul li span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.footer-col ul li .icon {
  width: clamp(18px, 1.5vw, 22px);
  height: clamp(18px, 1.5vw, 22px);
  flex-shrink: 0;
  object-fit: contain;
  margin-top: 4px;
}

/* ── 社群圖示 ── */
.social-icons {
  display: flex;
  gap: clamp(12px, 1.5vw, 20px);
  justify-content: center;
  margin-top: clamp(10px, 1.5vw, 16px);
}

.social-icons a {
  display: grid;
  width: clamp(42px, 5vw, 52px);
  height: clamp(42px, 5vw, 52px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  transition: background 0.2s ease, transform 0.2s ease;
  place-items: center;
}

.social-icons a:hover,
.social-icons a:focus-visible {
  background: rgba(255, 255, 255, 0.16);
  outline: 3px solid rgba(120, 201, 223, 0.32);
  transform: translateY(-3px);
}

.social-icons img {
  width: 62%;
  height: 62%;
  display: block;
  object-fit: contain;
}

/* ── 版權列 ── */
.footer-bottom {
  width: min(100%, 1240px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: clamp(16px, 2vw, 24px);
  margin: clamp(24px, 4vw, 40px) auto 0;
  font-size: clamp(11px, 1.1vw, 14px);
  text-align: center;
  opacity: 0.9;
}

.footer-bottom p {
  margin: 4px 0;
}

/* ── 中尺寸 (640px+)：切 2 欄，內容保持置中 ── */
@media (min-width: 640px) {
  .footer {
    padding-top: clamp(48px, 7vw, 76px);
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
    column-gap: clamp(32px, 7vw, 70px);
    row-gap: clamp(36px, 5vw, 52px);
  }

  /* 聯絡資訊跨兩欄置中 */
  .footer-col--contact {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    margin: clamp(24px, 4vw, 50px) auto 0;
    padding-top: clamp(14px, 2vw, 22px);
  }

  .footer-bottom p {
    display: inline;
    margin: 0;
  }

  .footer-bottom p + p::before {
    content: ' | ';
    margin: 0 8px;
  }
}

/* ── 大尺寸 (1024px+)：3 欄，流動間距不溢出 ── */
@media (min-width: 1024px) {
  .footer {
    min-height: 200px;
    padding-top: clamp(56px, 6vw, 84px);
  }

  .footer-content {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1fr)
      minmax(0, 1.4fr);
    gap: 200px;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
  }

  /* 大尺寸三欄，聯絡欄恢復正常流 */
  .footer-col--contact {
    grid-column: auto;
  }

  /* 大尺寸文字左對齊 */
  .footer-col {
    text-align: left;
  }

  .footer-col h3::after {
    left: 0;
    transform: none;
  }

  .footer-col p {
    margin-left: 0;
  }

  .footer-col ul li {
    justify-content: flex-start;
    margin-left: 0;
  }

  .social-icons {
    justify-content: flex-start;
  }
}

@media (min-width: 1280px) {
  .footer {
    z-index: 10000;
    margin-top: clamp(-130px, -8vw, -90px);
    padding-top: clamp(150px, 15vw, 210px);
    background: url('@/assets/image/Vector-3.png') top center / 100% 100% no-repeat;
  }
}

@media (max-width: 380px) {
  .footer {
    padding-inline: 14px;
  }

  .footer-col ul li {
    font-size: 13px;
  }

  .footer-bottom p {
    line-height: 1.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .social-icons a {
    transition-duration: 0.01ms;
  }
}
</style>
