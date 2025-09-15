import styles from './index.module.scss';

const MainTourGuide = () => {
  return (
    <div className={styles.homePage} id="home-page">
      <div className={styles.homeContainer}>
        {/* 顶部导航栏 */}
        <div className={styles.topNav}>
          <div className={styles.navContent}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <i className={`fas fa-eye ${styles.eyeIcon}`}></i>
              </div>
              <h1 className={styles.logoText}>万象镜</h1>
            </div>
            <div className={styles.navActions}>
              <button className={styles.locationButton} id="location-btn">
                <i className={`fas fa-map-marker-alt ${styles.locationIcon}`}></i>
                <span className={styles.locationText} id="current-location">定位中...</span>
              </button>
              <button className={styles.profileButton} id="user-profile-btn">
                <i className={`fas fa-user ${styles.userIcon}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* 首页内容 */}
        <div className={styles.contentContainer}>
          {/* 推荐景区 */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>推荐景区</h2>
              <a className={styles.viewAllLink} href="javascript:void(0);">
                查看全部
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </a>
            </div>
            <div className={styles.attractionGrid}>
              {/* 景区卡片1 */}
              <div className={styles.attractionCard} id="attraction-card-1">
                <div className={styles.cardImageContainer}>
                  <img
                    alt="故宫博物院"
                    className={styles.cardImage}
                    src="https://design.gemcoder.com/staticResource/echoAiSystemImages/60ec0cf126e978ec8f20e9041b795546.png"
                  />
                  <div className={styles.hotTag}>热门</div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>故宫博物院</h3>
                  <div className={styles.ratingContainer}>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star-half-alt ${styles.starIcon}`}></i>
                    <span className={styles.ratingText}> (4.8) </span>
                  </div>
                  <p className={styles.cardDescription}>
                    中国明清两代皇家宫殿，世界文化遗产，拥有大量珍贵文物和历史建筑。
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.guideText}>AI智能导览</span>
                    <button className={styles.arrowButton}>
                      <i className={`fas fa-arrow-right ${styles.arrowIcon}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* 景区卡片2 */}
              <div className={styles.attractionCard} id="attraction-card-2">
                <div className={styles.cardImageContainer}>
                  <img
                    alt="秦始皇兵马俑"
                    className={styles.cardImage}
                    src='./api/searchImage?query=terracotta warriors in xi"an, china, ancient history museum, archaeological site, professional photography&width=600&height=400'
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>秦始皇兵马俑</h3>
                  <div className={styles.ratingContainer}>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <span className={styles.ratingText}> (4.9) </span>
                  </div>
                  <p className={styles.cardDescription}>
                    世界第八大奇迹，秦始皇陵的陪葬坑，出土了数千个真人大小的陶制士兵和战马。
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.guideText}>AI智能导览</span>
                    <button className={styles.arrowButton}>
                      <i className={`fas fa-arrow-right ${styles.arrowIcon}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* 景区卡片3 */}
              <div className={styles.attractionCard} id="attraction-card-3">
                <div className={styles.cardImageContainer}>
                  <img
                    alt="颐和园"
                    className={styles.cardImage}
                    src="https://design.gemcoder.com/staticResource/echoAiSystemImages/09ead6d2186ed541588cea3c0a6eb443.png"
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>颐和园</h3>
                  <div className={styles.ratingContainer}>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`fas fa-star ${styles.starIcon}`}></i>
                    <i className={`far fa-star ${styles.starIcon}`}></i>
                    <span className={styles.ratingText}> (4.2) </span>
                  </div>
                  <p className={styles.cardDescription}>
                    中国清朝皇家园林，前身为清漪园，是保存最完整的一座皇家行宫御苑。
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.guideText}>AI智能导览</span>
                    <button className={styles.arrowButton}>
                      <i className={`fas fa-arrow-right ${styles.arrowIcon}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 最新资讯 */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>最新资讯</h2>
              <a className={styles.viewAllLink} href="javascript:void(0);">
                更多资讯
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </a>
            </div>
            <div className={styles.newsGrid}>
              {/* 资讯卡片1 */}
              <div className={styles.newsCard} id="news-card-1">
                <div className={styles.newsImageContainer}>
                  <img
                    alt="展览资讯"
                    className={styles.newsImage}
                    src="https://design.gemcoder.com/staticResource/echoAiSystemImages/55ad24772bd345e12133dee0f1298862.png"
                  />
                </div>
                <div className={styles.newsContent}>
                  <span className={styles.newsTag}>展览信息</span>
                  <h3 className={styles.newsTitle}>
                    故宫博物院将举办"丝路文明"特展，展示古代丝绸之路文物
                  </h3>
                  <p className={styles.newsMeta}>
                    2023-10-15 · 阅读 2.3万
                  </p>
                </div>
              </div>

              {/* 资讯卡片2 */}
              <div className={styles.newsCard} id="news-card-2">
                <div className={styles.newsImageContainer}>
                  <img
                    alt="考古发现"
                    className={styles.newsImage}
                    src="https://design.gemcoder.com/staticResource/echoAiSystemImages/1c45b815c67fd6d53eb0a84250a59c16.png"
                  />
                </div>
                <div className={styles.newsContent}>
                  <span className={`${styles.newsTag} ${styles.accentTag}`}>考古发现</span>
                  <h3 className={styles.newsTitle}>
                    三星堆遗址新发现6座祭祀坑，出土大量青铜文物
                  </h3>
                  <p className={styles.newsMeta}>
                    2023-10-10 · 阅读 5.7万
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 相关文章 */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>相关文章</h2>
            </div>
            <div className={styles.articleList}>
              {/* 文章项1 */}
              <div className={styles.articleItem} id="article-item-1">
                <div className={styles.articleIconContainer}>
                  <div className={styles.articleIconPrimary}>
                    <i className={`fas fa-book ${styles.articleIcon}`}></i>
                  </div>
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>
                    如何更好地参观博物馆？专家分享5个实用技巧
                  </h3>
                  <p className={styles.articleMeta}>文化学者 · 10分钟阅读</p>
                </div>
                <i className={`fas fa-chevron-right ${styles.articleChevron}`}></i>
              </div>

              {/* 文章项2 */}
              <div className={styles.articleItem} id="article-item-2">
                <div className={styles.articleIconContainer}>
                  <div className={styles.articleIconSecondary}>
                    <i className={`fas fa-lightbulb ${styles.articleIcon}`}></i>
                  </div>
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>
                    AI导览技术如何改变我们的参观体验
                  </h3>
                  <p className={styles.articleMeta}>科技专栏 · 8分钟阅读</p>
                </div>
                <i className={`fas fa-chevron-right ${styles.articleChevron}`}></i>
              </div>

              {/* 文章项3 */}
              <div className={styles.articleItem} id="article-item-3">
                <div className={styles.articleIconContainer}>
                  <div className={styles.articleIconAccent}>
                    <i className={`fas fa-history ${styles.articleIcon}`}></i>
                  </div>
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>
                    中国十大博物馆背后的历史故事
                  </h3>
                  <p className={styles.articleMeta}>历史研究员 · 15分钟阅读</p>
                </div>
                <i className={`fas fa-chevron-right ${styles.articleChevron}`}></i>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainTourGuide;