<template>
  <div>
    <!-- Hero 區塊 -->
<section class="hero">
  <div class="hero-container">
    <!-- 左側圖片區 -->
    <div class="hero-image">
      <img src="@/assets/image/Group-75.webp" alt="Dog and Cat" />
    </div>

    <!-- 右側文字區 -->
    <div class="hero-text">
      <h1>人人動物醫院埔心分院</h1>
      <p>
        用心守護每個<br />
        毛孩子的健康與幸福
      </p>
    </div>
  </div>
</section>

    <!-- 診所簡介區塊 -->
    <section class="intro">
      <div class="intro-title">
        <h2>診所簡介</h2>
        <img src="@/assets/image/Objects.webp" alt="icon" />
      </div>

      <div class="intro-content">
        <div class="intro-left">
          <div class="intro-item">
            <img src="@/assets/image/Vector.webp" alt="icon" />
            <div>
              <h3>人人動物醫院埔心分院</h3>
              <p>本院位於楊梅區永美路274號(埔心車站同一側)</p>
            </div>
          </div>
          <div class="intro-item">
            <img src="@/assets/image/Group.webp" alt="icon" />
            <div>
              <h3>一般門診皆為現場掛號</h3>
              <p>如有手術諮詢、健檢諮詢或其他需求，請於營業時間致電本院</p>
            </div>
          </div>
          <div class="intro-item">
            <img src="@/assets/image/Vector (1).webp" alt="icon" />
            <div>
              <h3>本院設備</h3>
              <p>人醫等級HEPA系統的標準手術室、GE全自動麻醉機、BOWA高級電刀系統、DR X光、牙科專用X光、軟式及硬式內視鏡、實驗室等級血液生化分析儀、杜普勒彩色超音波…等</p>
            </div>
          </div>
          <div class="intro-item">
            <img src="@/assets/image/Group 31.webp" alt="icon" />
            <div>
              <h3>本院醫師專長</h3>
              <p>犬貓內科、外科、產科、心臟科、齒科、神經內科、雷射治療、再生醫療</p>
            </div>
          </div>
        </div>

        <div class="intro-right">
          <img src="@/assets/image/image 7.webp" alt="Clinic Cat" />
        </div>
      </div>
    </section>

    <!-- 飼主反饋 + 常見問題 區塊 -->
<section class="feedback-faq">

  <div class="section-title">
    <img src="@/assets/image/Objects (1).webp" alt="icon" />
    <h2>飼主反饋</h2>
  </div>

  <section class="feedback">
    <div class="feedback-layout">

      <!-- 左側：圖片 + 評分摘要 -->
      <div class="feedback-left">
        <img src="@/assets/image/Group 76.webp" alt="Owner with pet" />
        <div class="feedback-summary">
          <div class="summary-score">5.0</div>
          <div class="summary-stars">★★★★★</div>
        </div>
      </div>

      <!-- 右側：卡片 Grid -->
      <div
        class="feedback-grid"
        role="region"
        aria-label="飼主評價列表"
        tabindex="0"
      >
        <article
          class="feedback-card"
          v-for="(item, index) in feedbacks"
          :key="index"
        >
          <div class="card-body-wrap">
           
            <p class="card-comment" :ref="'comment' + index">
              {{ stripHtml(item.comment) }}
            </p>
            <button
              class="card-more"
              v-if="overflowMap[index]"
              type="button"
              @click="openFeedback(item)"
            >
              ...顯示更多
            </button>
          </div>

          <div class="card-divider"></div>

          <div class="card-footer">
            <img class="avatar" :src="item.avatar" :alt="item.name" />
            <div class="reviewer-info">
              <div class="reviewer-name-row">
                <h3>{{ item.name }}</h3>
                <div class="stars" :aria-label="`${item.stars} 顆星`">
                  <span
                    v-for="i in 5"
                    :key="i"
                    :class="{ filled: i <= item.stars }"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

    </div>
  </section>

  <Transition name="feedback-modal">
    <div
      class="modal-bg"
      v-if="activeFeedback"
      role="presentation"
    >
      <div
        class="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <button
          ref="feedbackCloseButton"
          class="modal-icon-close"
          type="button"
          aria-label="關閉完整評價"
          @click="closeFeedback"
        >
          ×
        </button>

        <p class="modal-comment" v-html="activeFeedback.comment"></p>

        <div class="card-divider"></div>

        <div class="card-footer modal-footer">
          <img
            class="avatar"
            :src="activeFeedback.avatar"
            :alt="activeFeedback.name"
          />
          <div class="reviewer-info">
            <div class="reviewer-name-row">
              <h3 id="feedback-modal-title">{{ activeFeedback.name }}</h3>
              <div class="stars" :aria-label="`${activeFeedback.stars} 顆星`">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="{ filled: i <= activeFeedback.stars }"
                  aria-hidden="true"
                >
                  ★
                </span>
              </div>
            </div>
            <span class="review-source">Google 評價</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- 常見問題 -->
  <div class="section-title faq-title">
    <h3>常見問題</h3>
    <img src="@/assets/image/Objects (1).webp" alt="icon" />
  </div>

  <div class="faq-content">
    <div class="faq-item" v-for="(faq, i) in faqs" :key="i">
      <button class="faq-question" @click="toggleFaq(i)">
        {{ faq.question }}
        <span>{{ faq.open ? '▲' : '▼' }}</span>
      </button>
      <div v-show="faq.open" class="faq-answer">
        <p>{{ faq.answer }}</p>
      </div>
    </div>
  </div>

</section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',

  setup() {
    useSeoMeta({
      title:              '人人動物醫院埔心分院｜楊梅獸醫推薦｜犬貓內外科、牙科、雷射治療',
      description:        '人人動物醫院埔心分院位於桃園市楊梅區，提供專業犬貓內外科、牙科、心臟科、雷射治療與再生醫療服務，用心守護每隻毛孩的健康。',
      keywords:           '楊梅動物醫院, 埔心獸醫, 人人動物醫院, 桃園獸醫推薦, 狗狗看診, 貓咪健檢, 雷射治療, 蔡欣叡醫師, 陳俊憲醫師',
      ogTitle:            '人人動物醫院埔心分院',
      ogDescription:      '專業犬貓醫療團隊｜楊梅永美路動物醫院｜內外科、牙科、雷射治療、再生醫療。',
      ogImage:            'https://www.zmnzmnpusin.com.tw/og-image.webp',
      ogUrl:              'https://www.zmnzmnpusin.com.tw/',
      ogType:             'website',
      twitterCard:        'summary_large_image',
      twitterTitle:       '人人動物醫院埔心分院｜楊梅獸醫推薦',
      twitterDescription: '專業犬貓內外科、牙科、心臟科、雷射治療與再生醫療，用心守護每隻毛孩的健康。',
    })
    useHead({
      link: [{ rel: 'canonical', href: 'https://www.zmnzmnpusin.com.tw/' }],
      script: [
        {
          key:       'home-jsonld',
          type:      'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'VeterinaryCare',
            name:       '人人動物醫院埔心分院',
            image:      'https://www.zmnzmnpusin.com.tw/img/Mask%20group.aa3631b4.webp',
            address: {
              '@type':         'PostalAddress',
              streetAddress:   '桃園市楊梅區永美路274號',
              addressLocality: '楊梅區',
              addressRegion:   '桃園市',
              postalCode:      '326',
              addressCountry:  'TW',
            },
            telephone:    '(03) 431-5700',
            url:          'https://www.zmnzmnpusin.com.tw/',
            geo:          { '@type': 'GeoCoordinates', latitude: 24.9109, longitude: 121.1524 },
            openingHours: 'Mo-Su 10:00-21:00',
            sameAs: [
              'https://maps.app.goo.gl/izx33mmPc3FbmdnF9',
              'https://www.facebook.com/PusinAH034315700',
            ],
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '200' },
          }),
        },
      ],
    })
  },

  data() {
    return {
      activeFeedback: null,
      overflowMap: {},
      feedbackResizeObserver: null,
      feedbackMeasureFrame: null,
      originalBodyOverflow: '',

      faqs: [
        { question: '你們是 24 小時動物醫院嗎？', answer: '本院並非 24 小時營業。為維持門診正常運作，非門診時間掛號需加收急診掛號費 500 元。', open: false },
        { question: '一般門診要怎麼掛號？', answer: '一般門診請現場掛號。如需指定醫師，請事先告知櫃台人員。若需手術或健檢，建議提前電話預約或現場諮詢。', open: false },
        { question: '慢性病領藥要怎麼辦？', answer: '慢性病患者請於前一個診次來電預約領藥。如於早診時段預約領藥，取藥時間會安排在下午診次。', open: false },
        { question: '醫院會臨時休診嗎？', answer: '本院每月不定期舉辦院內研討會。若需休診，將於前一週公告於粉絲專頁。如遇臨時休診，請依現場公告或加入本院官方 LINE 以獲取最新消息。', open: false },
        { question: '要如何預約或詢問？', answer: '您可以透過電話 (03) 431-5700 或親洽櫃台預約。地址為桃園市楊梅區永美路274號。', open: false },
        { question: '掛號費用是多少？', answer: '一般門診掛號費依醫師門診類型為主；非門診時段急診掛號費為 500 元，實際費用請以現場公告為準。', open: false },
        { question: '健康檢查或手術可以線上預約嗎？', answer: '目前採電話或現場預約方式。我們建議提前預約，讓醫師可充分安排時間與術前評估。', open: false },
        { question: '還有什麼特別需要注意的嗎？', answer: '本院建議飼主在預約與看診時，攜帶完整病歷與疫苗紀錄。若寵物有特殊狀況或用藥，請事先告知醫師。感謝您的配合，讓我們能提供更安全有效的醫療服務。', open: false },
      ],

      feedbacks: [
        {
          name: '吳宛靜',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXe1flsCPYg24oFyw7Z-8gnGJ3kHCx7lteKQInc0ZaodzA6b_se=w72-h72-p-rp-mo-br100',
          comment: '感謝人人動物醫院的醫生和護理人員的細心照顧，我家貝貝因為血尿再檢查過程中，醫生非常細心的診斷，同時還發現其他部位的腫瘤，安排手術後，住院觀察期間，因為我家貝貝脾氣非常不好很兇還會攻擊醫護人員，但醫生護士都非常專業，先安撫貝貝，再做診斷，腫瘤報告為良性的，今天也平安出院，真的非常感謝人人的醫護團隊，服務很好非常的專業。我家的四隻寶貝每年都會來定期的健檢，有你們守護我安心😘',
          stars: 5,
        },
        {
          name: 'Y Tsai',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXNp5MdqH2oZbHHqfO-ff6wJq2gIPwmTkr_0iI5O1nCgxaQnWgE=w72-h72-p-rp-mo-ba12-br100',
          comment: '醫生細心之餘跟貓咪的互動看得出來對動物很有愛心❤️，對人類的一些問題也都很有耐心的回答，也謝謝獸助拿優點給我能讓我及時處理被咬到的傷口🥹 然後666的眼睛腫眼藥水一週後也好很多，這幾天也順利搬去南部住大房子了～（絕對不會放養請安心）',
          stars: 5,
        },
        {
          name: '玲蓉黃',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIA4S5kc9S_cD-iPvi9ypmErPrEddr_aikxd3A39SXJGfDlxQ=w72-h72-p-rp-mo-br100',
          comment: '醫院的醫生就我所接觸到的目前都很不錯很棒，都很有耐心解說毛孩的狀況，真的是為毛孩好的念想很有醫德。助理也服務態度很好。',
          stars: 5,
        },
        {
          name: 'Hyumu',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjX5d89-rFW84uBT5OoRotYwbPrzU2bfPX6cCw4VIOapUiQCJf5j=w72-h72-p-rp-mo-br100',
          comment: '因貓兒被龜殼花咬傷而急忙送醫，雖然院內無血清，但仍有耐心、熱心地為我們查詢了鄰近可能有血清庫存的動物醫院。真的非常感激接聽電話的男櫃員／護理師，若沒有您，我們絕對無法在這麼短的時間內為貓兒爭取到這珍貴的一劑，謝謝您！',
          stars: 5,
        },
        {
          name: '妞妞沁琳',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIIK-RRSZ0J127Iz_agfAY1-INrb5rXeIEmMAC62mnLiGOAuA=w72-h72-p-rp-mo-ba12-br100',
          comment: '醫生問診很親切仔細，對貓咪疾病非常了解，而且認真回應解釋每一個問題，為毛孩症狀做醫護調整。',
          stars: 5,
        },
        {
          name: 'Hao Hsieh',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLtJDQ3BeWTjPsb7xEDXpajq2AOevZfErDTyKDL9VuL9cKGin0h=w72-h72-p-rp-mo-ba12-br100',
          comment: '空間整潔明亮又沒有刺鼻藥水味，這點對毛孩來說很重要，謝謝姚醫師這麼注重細節。',
          stars: 5,
        },
        {
          name: 'SA ER',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLnRcrRxgl_iSMwy_vF2JF165LhQH0jwRL_URAm_g3JC2KbKw=w72-h72-p-rp-mo-ba12-br100',
          comment: '我家狗狗的皮膚病困擾很久，換了幾家醫院都沒改善，來到這裡終於找到原因並治癒了，非常感謝。',
          stars: 5,
        },
        {
          name: 'LeLe',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVKqBjmShddWFsEenbQaLCwyVuLpmMRsZfECIrDsjOsBQ6tNVnc=w72-h72-p-rp-mo-br100',
          comment: '我們家寶貝是標準吉娃娃，之前常常大吼叫到昏倒，後來查出有心臟和氣管塌陷的問題，定期拿藥治療，已經很久沒有再發生問題了，真的從來沒有想過狗狗會有心臟問題，謝謝醫院醫師和助理的細心講解和治療，收費也合理。',
          stars: 5,
        },
        {
          name: 'Rachel Huang',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW_5Kcbam_B6Oi-ZTUMkPAaDAPpFIPV9OExdkN0AVJjzPke4f4=w72-h72-p-rp-mo-ba12-br100',
          comment: '感謝陳俊憲醫師對我們家毛孩的悉心照料，陳醫師真的讓我們感覺到很把我們毛孩的狀況放在心上用心處理，就算是沒有值班也會交代好同事接手，真的非常認真負責～另外收費也很合理，感謝埔心有一間值得我們信賴的獸醫院，讓我們沒有後顧之憂，感謝您們！！',
          stars: 5,
        },
        {
          name: '彥',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXsMsH3vRxtvdgsRzDsNQcRhaPaFEDlXJNe3FV089n3i-3udG6S=w72-h72-p-rp-mo-br100',
          comment: '診斷過程中，呂醫師都會提供多種治療方式，並清楚說明每種方案的優缺點，讓人安心。',
          stars: 5,
        },
        {
          name: '錢呈恩',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjX-XDHmN-YIdfF-tj-OF6jGSq0GhmnSmUhKUZUwjMpPDKz9PG4=w72-h72-p-rp-mo-br100',
          comment: '最近幾次帶毛孩回診，時間都抓得剛剛好，幾乎不用等，謝謝蔡醫師安排得這麼有效率。',
          stars: 5,
        },
        {
          name: 'Muf',
          avatar: 'https://lh3.googleusercontent.com/a/ACg8ocK7DeaO6y_h9IU9UZRDw1GxpizkRKQL0sg1ApzWK4e2BliTgIE=w72-h72-p-rp-mo-ba12-br100',
          comment: '謝謝小杰醫生幫忙治療家中奧嘟嘟小公主，醫生都會詳細說明病況跟在家照護方法；也謝謝貼心的助理協助～',
          stars: 5,
        },
        {
          name: 'Maliyang Liu',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjV5trByvTEzpM4Wfcqpw6GIoLM2sax2Y5Zw91cc1zsrE1fr_YMj=w72-h72-p-rp-mo-br100',
          comment: '謝謝林醫生與助理：在我對嚴重受傷毛孩心疼無奈時，醫生細心解說，讓我對醫生及毛孩更有信心！雖第一次到人人，但憂傷的心因為醫生而心情緩解！明天動手術了！願一切順利平安，不願接到任何電話！只期待去接毛孩回家休養！醫生護士辛苦了！謝謝你們😊',
          stars: 5,
        },
        {
          name: '卯咪',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjX6qfIUlejg5Pjm1G7ioRlXPZEuSOEu9Wm_T4Z5DJES309qHaKd=w72-h72-p-rp-mo-ba12-br100',
          comment: '5星是給櫃檯跟林醫生的！！！<br>櫃檯有兩三位小姐態度還不錯<br>獸醫助理有一兩位也滿熟練的<br>陳醫生講解很仔細，有問題都會回答<br>沒有不耐心或者覺得煩<br>他沒辦法處理病情較複雜的部分<br>也會推薦我們其他方式或去總院治療<br>感覺得出他對每隻寵物都是有付出愛心及關懷<br>沒有隨便對待，也沒有覺得只是來上班的<br>也會記得寵物的病況<br>他不在的時候也會盡量交接給其他醫生<br>每次看診都希望陳醫生在會比較好<br><br>然後環境整體來說還不錯，算蠻乾淨明亮的。<br>診間夠大間，對貓貓狗狗來說不會有壓迫感。<br>只是設備沒有到極精密，有些病情較複雜的還是需要去總院做檢查。<br>候診時間不一定，要看現場狀況。<br>有需要定期拿藥的，建議打電話請他們先準備會比較快。<br><br>偶爾院內會有休診，要注意一下時間。',
          stars: 5,
        },
        {
          name: 'CHIA YUN LEE',
          avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVXIUfu5XIIXOwvSH-YH1XX8Yr1gpULXqTQJOTicbCl4r5VYdw=w72-h72-p-rp-mo-br100',
          comment: '我家大福呆從小生病定期在人人回診檢查<br>每次去醫院他都很開心，每個醫生跟護理師小姐姐也很喜歡跟我們家寶貝玩！<br>看診到現在一年多的時間覺得每位醫師都很專業<br>而且看到寶貝都會來跟我們打招呼🙋🏻‍♀️<br>護士也都很親切三不五時就拿小零食給大福呆吃👍🏻（不小心直接大小便也都會幫忙清理）<br>之前住院看到他在醫院還可以這麼舒適又自在<br>讓媽媽我覺得可以很放心的把寶貝交給他們照顧！',
          stars: 5,
        },
      ],
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.measureFeedbackOverflow()

      this.feedbackResizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(this.feedbackMeasureFrame)
        this.feedbackMeasureFrame = requestAnimationFrame(() => {
          this.measureFeedbackOverflow()
        })
      })

      this.$el.querySelectorAll('.card-comment').forEach((comment) => {
        this.feedbackResizeObserver.observe(comment)
      })
    })

    window.addEventListener('keydown', this.handleFeedbackKeydown)
  },

  beforeUnmount() {
    this.feedbackResizeObserver?.disconnect()
    cancelAnimationFrame(this.feedbackMeasureFrame)
    window.removeEventListener('keydown', this.handleFeedbackKeydown)
    document.body.style.overflow = this.originalBodyOverflow
  },

  methods: {
    toggleFaq(index) {
      if (this.faqs[index].open) {
        this.faqs[index].open = false
      } else {
        this.faqs.forEach((faq, i) => {
          faq.open = i === index
        })
      }
    },

    stripHtml(html) {
      return html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    },

    measureFeedbackOverflow() {
      const nextOverflowMap = {}

      this.feedbacks.forEach((_, index) => {
        const ref = this.$refs['comment' + index]
        const comment = Array.isArray(ref) ? ref[0] : ref

        if (comment) {
          nextOverflowMap[index] =
            comment.scrollHeight > comment.clientHeight + 2
        }
      })

      this.overflowMap = nextOverflowMap
    },

    openFeedback(item) {
      this.activeFeedback = item
      this.originalBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      this.$nextTick(() => this.$refs.feedbackCloseButton?.focus())
    },

    closeFeedback() {
      this.activeFeedback = null
      document.body.style.overflow = this.originalBodyOverflow
    },

    handleFeedbackKeydown(event) {
      if (event.key === 'Escape' && this.activeFeedback) {
        this.closeFeedback()
      }
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}

img {
  max-width: 100%;
}
 
/* ================= Hero ================= */
.hero {
  display: grid;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 72px);
  min-height: min(760px, calc(100svh - 72px));
  padding: clamp(40px, 7vw, 88px) clamp(16px, 5vw, 80px);
  overflow: hidden;
  background-color: #fffaf0;
}

.hero-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: clamp(24px, 5vw, 72px);
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}
 
.hero-image {
  display: grid;
  width: 100%;
  min-width: 0;
  place-items: center;
}

.hero-image img {
  display: block;
  width: min(100%, 520px);
  height: auto;
}
 
.hero-text {
  min-width: 0;
  color: #123d63;
  text-align: center;
}

.hero-text h1 {
  margin: 0 0 clamp(14px, 2vw, 24px);
  font-size: clamp(26px, 5vw, 42px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.hero-text p {
  max-width: 28ch;
  margin: 0 auto;
  font-size: clamp(16px, 3.2vw, 24px);
  font-weight: 600;
  line-height: 1.7;
  letter-spacing: 0.06em;
  overflow-wrap: anywhere;
}

@media (max-width: 479px) {
  .hero {
    min-height: auto;
    padding: 32px 16px 44px;
  }

  .hero-image img {
    width: min(92%, 340px);
  }

  .hero-text h1 {
    letter-spacing: 0.02em;
  }
}
 
@media (min-width: 768px) {
  .hero {
    min-height: clamp(560px, 68svh, 760px);
  }

  .hero-container {
    grid-template-columns: minmax(280px, 1.05fr) minmax(280px, 0.95fr);
  }
 
  .hero-text {
    text-align: left;
  }

  .hero-text p {
    margin-left: 0;
  }
}

@media (min-width: 1200px) {
  .hero-image img {
    width: min(100%, 580px);
  }
}
 
/* ================= 診所簡介 ================= */
.intro {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: clamp(40px, 6vw, 72px) clamp(16px, 4vw, 56px)
    clamp(96px, 13vw, 190px);
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
 
.intro-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 0.8vw, 10px);
  margin-bottom: clamp(20px, 3vw, 40px);
}
 
.intro-title img {
  width: clamp(24px, 2vw, 36px);
  height: auto;
}
 
.intro-title h2 {
  margin: 0;
  font-size: clamp(18px, 2vw, 28px);
  font-weight: 700;
  color: #133b63;
}
 
.intro-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(28px, 5vw, 60px);
  width: min(100%, 1240px);
  margin: 0 auto;
}
 
.intro-left {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 28px);
  min-width: 0;
}
 
.intro-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: clamp(12px, 2vw, 20px);
  min-width: 0;
}
 
.intro-item img {
  width: clamp(28px, 2.5vw, 44px);
  height: auto;
  margin-top: 2px;
  flex-shrink: 0;
}
 
.intro-item h3 {
  margin: 0 0 4px;
  font-size: clamp(15px, 1.5vw, 20px);
  font-weight: 700;
  color: #133b63;
  overflow-wrap: anywhere;
}
 
.intro-item p {
  margin: 0;
  font-size: clamp(13px, 1.2vw, 15px);
  color: #333;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
 
.intro-right {
  display: grid;
  min-width: 0;
  text-align: center;
  place-items: center;
}
 
.intro-right img {
  display: block;
  width: min(100%, 560px);
  height: auto;
  border-radius: 8px;
}
 
@media (max-width: 479px) {
  .intro-item {
    grid-template-columns: 32px minmax(0, 1fr);
  }
}

@media (min-width: 768px) {
  .intro-content {
    grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
    align-items: center;
  }
 
}
 
@media (min-width: 1400px) {
  .intro-content {
    max-width: 1320px;
  }
}
 
/* ================= 飼主反饋 + FAQ 共用背景 ================= */
.feedback-faq {
  position: relative;
  z-index: 9999;
  width: 100%;
  margin-top: -50px;
  padding:
    clamp(110px, 15vw, 190px)
    clamp(14px, 4vw, 56px)
    clamp(48px, 7vw, 80px);
  color: #133b63;
  background: #fff url('@/assets/image/Vector 2.webp') no-repeat center top / cover;
  border-top-left-radius: clamp(32px, 5vw, 64px);
  border-top-right-radius: clamp(32px, 5vw, 64px);
}

@media (min-width: 1280px) {
  .feedback-faq {
    padding-bottom: clamp(150px, 14vw, 210px);
  }
}
 
/* 標題 */
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(6px, 1vw, 14px);
  margin-bottom: clamp(10px, 1.5vw, 20px);
  margin-top: 0;
  text-align: center;
}
 
.faq-title {
  margin-top: clamp(36px, 6vw, 72px);
}
 
.section-title h2 {
  margin: 0;
  font-size: clamp(18px, 2vw, 30px);
  font-weight: 700;
  color: #ffffff;
}
 
.section-title h3 {
  margin: 0;
  font-size: clamp(18px, 2vw, 30px);
  font-weight: 700;
  color: #143c64;
}
 
.section-title img {
  width: clamp(22px, 2vw, 36px);
  height: auto;
}
 
/* ================= 飼主反饋 ================= */
.feedback {
  padding: clamp(18px, 3vw, 44px) 0;
}

.feedback-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: clamp(24px, 4vw, 56px);
  width: min(100%, 1280px);
  margin: 0 auto;
}

.feedback-left {
  display: grid;
  grid-template-columns: minmax(110px, 180px) minmax(100px, auto);
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: min(100%, 460px);
  padding: clamp(16px, 2vw, 24px);
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 24px;
  box-shadow: 0 16px 36px rgba(29, 76, 108, 0.12);
  backdrop-filter: blur(10px);
}

.feedback-left img {
  display: block;
  width: min(100%, 240px);
  height: auto;
  filter: drop-shadow(0 12px 16px rgba(30, 74, 101, 0.16));
}

.feedback-summary {
  min-width: 0;
  text-align: left;
}

.summary-score {
  color: #133b63;
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 800;
  line-height: 1;
}

.summary-stars {
  margin: 7px 0 5px;
  color: #fde57b;
  font-size: clamp(16px, 1.6vw, 20px);
  letter-spacing: 0.08em;
  text-shadow: 0 2px 5px rgba(246, 173, 36, 0.2);
}

.summary-count {
  color: #55758e;
  font-size: 13px;
  font-weight: 600;
}

.feedback-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  align-items: stretch;
  align-content: start;
  gap: clamp(12px, 1.6vw, 20px);
  min-width: 0;
  max-height: min(68vh, 680px);
  max-height: min(68svh, 680px);
  padding: 4px clamp(6px, 1vw, 12px) 12px 4px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  scrollbar-color: #4f91b8 rgba(255, 255, 255, 0.3);
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.feedback-grid:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.7);
  outline-offset: 5px;
  border-radius: 12px;
}

.feedback-grid::-webkit-scrollbar {
  width: 9px;
}

.feedback-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
}

.feedback-grid::-webkit-scrollbar-thumb {
  background: #4f91b8;
  border: 2px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
}

.feedback-grid::-webkit-scrollbar-thumb:hover {
  background: #33779f;
}

.feedback-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 218px;
  padding: clamp(16px, 1.6vw, 22px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(22, 67, 99, 0.1);
  transition: border-color 0.25s ease, box-shadow 0.25s ease,
    transform 0.25s ease;
}

.feedback-card::after {
  position: absolute;
  right: -36px;
  bottom: -44px;
  width: 110px;
  height: 110px;
  pointer-events: none;
  content: '';
  background: rgba(91, 164, 212, 0.08);
  border-radius: 50%;
}

.feedback-card:hover {
  border-color: rgba(91, 164, 212, 0.28);
  box-shadow: 0 14px 32px rgba(22, 67, 99, 0.16);
  transform: translateY(-4px);
}

.card-body-wrap {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-top: 12px;
}

.quote-mark {
  position: absolute;
  top: -12px;
  left: -2px;
  color: rgba(59, 130, 185, 0.18);
  font-family: Georgia, serif;
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
}

.card-comment {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #3f5363;
  font-size: clamp(13px, 1vw, 14px);
  line-height: 1.75;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.card-more {
  padding: 4px 0;
  margin-top: 2px;
  color: #2d7eaf;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: 0;
}

.card-more:hover,
.card-more:focus-visible {
  color: #195b85;
  text-decoration: underline;
  outline: none;
}

.card-divider {
  position: relative;
  z-index: 1;
  height: 1px;
  margin: 14px 0 12px;
  background: linear-gradient(
    90deg,
    rgba(43, 94, 128, 0.18),
    rgba(43, 94, 128, 0.03)
  );
}

.card-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.avatar {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  object-fit: cover;
  background: #e8f2f7;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(29, 76, 108, 0.14);
}

.reviewer-info {
  flex: 1;
  min-width: 0;
}

.reviewer-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px 8px;
}

.reviewer-name-row h3 {
  max-width: 100%;
  margin: 0;
  overflow: hidden;
  color: #133b63;
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stars {
  display: inline-flex;
  gap: 1px;
  color: #ccd6dc;
  font-size: 12px;
  line-height: 1;
}

.stars .filled {
  color: #f6ad24;
}

.review-source {
  display: block;
  margin-top: 4px;
  color: #7990a0;
  font-size: 11px;
}

/* ================= 完整評價視窗 ================= */
.modal-bg {
  position: fixed;
  z-index: 12000;
  inset: 0;
  display: grid;
  padding: clamp(16px, 4vw, 40px);
  overflow-y: auto;
  background: rgba(11, 34, 52, 0.62);
  place-items: center;
  backdrop-filter: blur(6px);
}

.modal-box {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 560px);
  max-height: min(82vh, 680px);
  padding: clamp(24px, 4vw, 38px);
  overflow-y: auto;
  background: #fffdf9;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(8, 29, 45, 0.32);
}

.modal-icon-close {
  position: absolute;
  top: 14px;
  right: 16px;
  display: grid;
  width: 38px;
  height: 38px;
  padding: 0 0 3px;
  color: #3f6580;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  background: #edf5f8;
  border: 0;
  border-radius: 50%;
  place-items: center;
}

.modal-icon-close:hover,
.modal-icon-close:focus-visible {
  color: #fff;
  background: #3b82b9;
  outline: 3px solid rgba(59, 130, 185, 0.2);
}

.modal-quote {
  height: 54px;
  color: rgba(59, 130, 185, 0.2);
  font-family: Georgia, serif;
  font-size: 76px;
  font-weight: 700;
  line-height: 1;
}

.modal-comment {
  margin: 0;
  margin-top: 20px;
  color: #344b5d;
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.9;
  overflow-wrap: anywhere;
}

.modal-footer {
  padding-right: 44px;
}

.modal-footer .avatar {
  width: 46px;
  height: 46px;
}

.modal-footer .reviewer-name-row h3 {
  font-size: 15px;
}

.modal-footer .stars {
  font-size: 14px;
}

.modal-close-btn {
  align-self: flex-end;
  min-width: 88px;
  padding: 9px 20px;
  margin-top: 22px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: #3b82b9;
  border: 0;
  border-radius: 999px;
}

.modal-close-btn:hover,
.modal-close-btn:focus-visible {
  background: #25678f;
  outline: 3px solid rgba(59, 130, 185, 0.2);
}

.feedback-modal-enter-active,
.feedback-modal-leave-active {
  transition: opacity 0.25s ease;
}

.feedback-modal-enter-active .modal-box,
.feedback-modal-leave-active .modal-box {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.feedback-modal-enter-from,
.feedback-modal-leave-to,
.feedback-modal-enter-from .modal-box,
.feedback-modal-leave-to .modal-box {
  opacity: 0;
}

.feedback-modal-enter-from .modal-box,
.feedback-modal-leave-to .modal-box {
  transform: translateY(18px) scale(0.98);
}

@media (min-width: 901px) {
  .feedback-layout {
    grid-template-columns: minmax(210px, 280px) minmax(0, 1fr);
  }

  .feedback-left {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .feedback-summary {
    text-align: center;
  }
}

@media (max-width: 560px) {
  .feedback-left {
    grid-template-columns: minmax(90px, 130px) minmax(90px, auto);
    gap: 14px;
    padding: 14px 18px;
    border-radius: 18px;
  }

  .feedback-grid {
    grid-template-columns: 1fr;
    max-height: min(66vh, 560px);
    max-height: min(66svh, 560px);
    padding-right: 6px;
  }

  .feedback-card {
    min-height: 190px;
    border-radius: 16px;
  }

  .modal-bg {
    padding: 10px;
    align-items: end;
  }

  .modal-box {
    width: 100%;
    max-height: 92vh;
    max-height: 92svh;
    padding: 24px 18px 20px;
    border-radius: 18px 18px 10px 10px;
  }

  .modal-footer {
    padding-right: 36px;
  }
}

@media (max-width: 359px) {
  .feedback-left {
    grid-template-columns: 1fr;
  }

  .feedback-left img {
    width: min(100%, 150px);
    margin: 0 auto;
  }

  .feedback-summary {
    text-align: center;
  }
}
 
/* ================= FAQ ================= */
.faq-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(8px, 1.2vw, 14px);
  width: min(100%, 1300px);
  margin: 0 auto;
}
 
.faq-item {
  border-radius: 8px;
  overflow: hidden;
}
 
.faq-question {
  width: 100%;
  background: #3b82b9;
  border: none;
  color: #fff;
  gap: 12px;
  min-height: 52px;
  font-size: clamp(13px, 1.4vw, 16px);
  font-weight: 600;
  text-align: left;
  padding: clamp(10px, 1.2vw, 16px) clamp(12px, 1.5vw, 18px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif;
  overflow-wrap: anywhere;
}
 
.faq-answer {
  background: rgba(255, 255, 255, 0.1);
  color: #133b63;
  padding: clamp(10px, 1.2vw, 18px) clamp(12px, 1.5vw, 18px);
  font-size: clamp(12px, 1.2vw, 14px);
  line-height: 1.6;
  overflow-wrap: anywhere;
}
 
.faq-answer p {
  margin: 0;
  white-space: pre-line;
}
 
@media (min-width: 800px) {
  .faq-content {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(12px, 1.5vw, 20px);
  }
}

@media (max-width: 479px) {
  .faq-question {
    padding: 12px;
  }

  .faq-answer {
    padding: 12px;
  }
}

@media (hover: none) {
  .feedback-card:hover {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 24px rgba(22, 67, 99, 0.1);
    transform: none;
  }
}
</style>
