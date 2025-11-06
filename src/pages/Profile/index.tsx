import { Button, ImageUploader, Popup, Space, Toast } from 'antd-mobile';
import styles from './index.module.scss';
import { CameraOutline, LeftOutline, UploadOutline } from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { url } from 'inspector';
import { fileUpload } from '@/api/common';
import { useState } from 'react';
import { Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { apiUpdateAvatar } from '@/api/user';
import { updateUser } from '@/store/slices/user';

const ProfilePage = () => {

  const { user, isLogin } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [avatarSetOpen, setAvatarSetOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar || "https://design.gemcoder.com/staticResource/echoAiSystemImages/494dd717c802938aad7d546b1678a1cd.png");

  const handleUploadAvatar = async (file: RcFile) => {
    // 处理上传头像逻辑
    const res = await fileUpload(file);
    Toast.show({ content: '头像上传成功！', duration: 2000, icon: 'success' });
    console.log(res);
    setAvatarUrl(`http://${location.hostname}:8888${res.url}`);
    return false; // 阻止 Upload 组件自动上传
  }
  const handleConfirmAvatar = () => {
    apiUpdateAvatar(avatarUrl).then(res => {
      Toast.show({ content: '头像更新成功！', duration: 2000, icon: 'success' });
      dispatch(updateUser({ ...user, avatar: avatarUrl }));
      setAvatarSetOpen(false);
    })
  }

  return (
    <div className={styles.profilePage} id="profile-page">
      <div className={styles.profileContainer}>
        {/* 顶部导航栏 */}
        <div className={styles.topNav}>
          <div className={styles.navContent}>
            <Button className={styles.backButton} fill='none' size='small'><LeftOutline /> 返回</Button>
            <h1 className={styles.title}>个人中心</h1>
            <div className={styles.spacer}></div>
          </div>
        </div>

        {/* 个人信息 */}
        <div className={styles.profileContent}>
          <div className={styles.userInfo}>
            <div className={styles.avatarContainer} onClick={() => setAvatarSetOpen(true)}>
              <img
                alt="用户头像"
                className={styles.avatar}
                src={user.avatar || "https://design.gemcoder.com/staticResource/echoAiSystemImages/494dd717c802938aad7d546b1678a1cd.png"}
              />
              <div className={styles.avatarEdit}>
                <CameraOutline className={styles.cameraIcon} />
              </div>
            </div>
            {
              isLogin ? <h2 className={styles.userName} id="user-name">{user.username || "游客"}</h2>
                : <>
                  <p className={styles.loginStatus} id="login-status">未登录</p>
                  <button className={styles.loginButton} id="go-to-login">
                    登录/注册
                  </button>
                </>

            }

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
      <Popup visible={avatarSetOpen} onMaskClick={() => setAvatarSetOpen(false)} onClose={() => setAvatarSetOpen(false)} position='bottom' bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} bodyClassName={styles.avatarPopup}>
        <div className={styles.avatarContainer}>
          <img
            alt="用户头像"
            className={styles.avatar}
            src={avatarUrl}
          />
        </div>
        <Upload fileList={[]} beforeUpload={handleUploadAvatar} showUploadList={false} >
          <Button block style={{ width: '200px', flex: 1 }} size='middle'><UploadOutline /> 上传头像</Button>
        </Upload>
        {/* <Button style={{width: '80px'}} block size='middle'  onClick={() => setAvatarSetOpen(false)}>取消</Button> */}
        <Button style={{ width: '200px' }} block size='middle' color='primary' onClick={handleConfirmAvatar}>确认</Button>
      </Popup>
    </div>
  );
};

export default ProfilePage;