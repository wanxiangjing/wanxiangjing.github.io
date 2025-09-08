import logo from '@/assets/img/logo.png';
import { Avatar, Button, Toast } from 'antd-mobile';
import { EyeFill, EyeInvisibleFill, LeftOutline, LockOutline, UserOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';
import styles from './index.module.scss';
import { isEmail, isPassword } from '@/utils/utils';

const LoginPage = () => {
    const [account, setAccount] = useState({
        email: '',
        password: '',
        verifyCode: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccount({
            ...account,

            [name]: value
        });
    }

    const handleLogin = () => {
        if (!account.email || !isEmail(account.email)) {
            Toast.show({
                icon: '!',
                content: '请输入正确格式的邮箱',
                duration: 1000,
            });
            return;
        }
        if (!account.password || !isPassword(account.password)) {
            Toast.show({
                icon: '!',
                content: '密码需8-16位，包含字母、数字和特殊字符',
                duration: 1000,
            });
            return;
        }

    }

    return (
        <div className={styles.loginPage} id="login-page">
            <div className={styles.loginContainer}>
                {/* 顶部导航栏 */}
                <div className={styles.topNav}>
                    <div className={styles.navContent}>
                        <div className={styles.backButton} >
                            <LeftOutline />
                            返回
                        </div>
                        <h1 className={styles.title}>登录账号</h1>
                        <div className={styles.placeholder}></div>
                    </div>
                </div>
                {/* 登录表单 */}
                <div className={styles.formContainer}>
                    <div className={styles.formWrapper}>
                        <div className={styles.header}>
                            <div className={styles.iconContainer}>
                                <Avatar src={logo} style={{ '--size': '64px' }}></Avatar>
                            </div>
                            <h2 className={styles.welcomeText}>欢迎使用万象镜</h2>
                            <p className={styles.subText}>登录后即可体验完整功能</p>
                        </div>
                        {/* 手机号登录 */}
                        <div className={styles.loginForm}>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputIcon}>
                                    <UserOutline />
                                </div>
                                <input
                                    value={account.email}
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="请输入邮箱"
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputIcon}>
                                    <LockOutline />
                                </div>
                                <input
                                    value={account.password}
                                    onChange={handleChange}
                                    type={passwordVisible ? 'text' : 'password'}
                                    // 增加可见密码功能
                                    name="password"
                                    id="password"
                                    placeholder="请输入密码"
                                    className={styles.inputField}
                                />

                                <div className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                                    {passwordVisible ? <EyeFill fontSize={18} /> : <EyeInvisibleFill fontSize={18} />}
                                </div>
                                {/* <div className={styles.verificationButton} id="get-verification">
                                    获取验证码
                                </div> */}
                            </div>
                            <Button className={styles.loginButton} block color='primary' onClick={() => handleLogin()}>
                                登录
                            </Button>
                        </div>
                        {/* 其他登录方式 */}
                        {/* <div className={styles.otherLogin}>
                            <p className={styles.otherLoginText}>其他登录方式</p>
                            <Button block className={styles.wechatButton} id="wechat-login">
                                微信登录
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;