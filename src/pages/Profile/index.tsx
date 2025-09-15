import styles from './index.module.scss';

const ProfilePage = () => {
  return (
    <div className={styles.profilePage} id="profile-page">
      <div className={styles.profileContainer}>
        {/* 顶部导航栏 */}
        <div className={styles.topNav}>
          <div className={styles.navContent}>
            <button className={styles.backButton} id="back-to-home">
              <i className={`fas fa-arrow-left ${styles.icon}`}></i>
              返回
            </button>
            <h1 className={styles.title}>个人中心</h1>
            <div className={styles.spacer}></div>
          </div>
        </div>

        {/* 个人信息 */}
        <div className={styles.profileContent}>
          <div className={styles.userInfo}>
            <div className={styles.avatarContainer}>
              <img
                alt="用户头像"
                className={styles.avatar}
                src="https://design.gemcoder.com/staticResource/echoAiSystemImages/494dd717c802938aad7d546b1678a1cd.png"
              />
              <div className={styles.avatarEdit}>
                <i className={`fas fa-camera ${styles.cameraIcon}`}></i>
              </div>
            </div>
            <h2 className={styles.userName} id="user-name">游客</h2>
            <p className={styles.loginStatus} id="login-status">未登录</p>
            <button className={styles.loginButton} id="go-to-login">
              登录/注册
            </button>
          </div>

          {/* 我的足迹 */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>我的足迹</h3>
            <div className={styles.footprintContainer} id="footprint-container">
              <div className={styles.emptyFootprint}>
                <i className={`fas fa-map-marker-alt ${styles.markerIcon}`}></i>
                <p className={styles.emptyText}>登录后查看您的参观记录</p>
              </div>
            </div>
          </section>

          {/* 功能菜单 */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>功能菜单</h3>
            <div className={styles.menuList}>
              <button className={styles.menuItem} id="profile-settings">
                <div className={styles.menuIconContainer}>
                  <div className={styles.menuIconPrimary}>
                    <i className={`fas fa-user-cog ${styles.menuIcon}`}></i>
                  </div>
                  <span className={styles.menuText}>个人设置</span>
                </div>
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </button>

              <button className={styles.menuItem} id="account-security">
                <div className={styles.menuIconContainer}>
                  <div className={styles.menuIconSecondary}>
                    <i className={`fas fa-shield-alt ${styles.menuIcon}`}></i>
                  </div>
                  <span className={styles.menuText}>账号安全</span>
                </div>
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </button>

              <button className={styles.menuItem} id="notification-settings">
                <div className={styles.menuIconContainer}>
                  <div className={styles.menuIconAccent}>
                    <i className={`fas fa-bell ${styles.menuIcon}`}></i>
                  </div>
                  <span className={styles.menuText}>通知设置</span>
                </div>
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </button>

              <button className={styles.menuItem} id="about-app">
                <div className={styles.menuIconContainer}>
                  <div className={styles.menuIconRed}>
                    <i className={`fas fa-info-circle ${styles.menuIcon}`}></i>
                  </div>
                  <span className={styles.menuText}>关于我们</span>
                </div>
                <i className={`fas fa-chevron-right ${styles.chevronIcon}`}></i>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;