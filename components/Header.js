import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';
import { Modal } from 'antd';
import Link from 'next/link';
import { resetHidden } from '../reducers/hiddenArticles';

function Header() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	const [date, setDate] = useState('2050-11-22T23:59:59');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [signUpUsername, setSignUpUsername] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signInUsername, setSignInUsername] = useState('');
	const [signInPassword, setSignInPassword] = useState('');

	useEffect(() => {
		setDate(new Date());
	}, []);

	const handleRegister = () => {
		fetch('https://morningnews-backend-olive-nu.vercel.app/users/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signUpUsername, token: data.token }));
					setSignUpUsername('');
					setSignUpPassword('');
					setIsModalVisible(false)
				}
			});
	};

	const handleConnection = () => {

		fetch('https://morningnews-backend-olive-nu.vercel.app/users/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signInUsername, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signInUsername, token: data.token }));
					setSignInUsername('');
					setSignInPassword('');
					setIsModalVisible(false)
				}
			});
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(removeAllBookmark());
	};

	const showModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const handleClickHiddens = () => {
		dispatch(resetHidden())
	}

	let modalContent;
	if (!user.isConnected) {
		modalContent = (
			<div className={styles.registerContainer}>
				<div className={styles.registerSection}>
					<p>Sign-up</p>
					<input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
					<input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
					<button id="register" onClick={() => handleRegister()}>Register</button>
				</div>
				<div className={styles.registerSection}>
					<p>Sign-in</p>
					<input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
					<input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
					<button id="connection" onClick={() => handleConnection()}>Connect</button>
				</div>
			</div>
		);
	}

	let userSection;
	if (user.token) {
		userSection = (
			<div className={styles.logoutSection}>
				<p>Welcome {user.username} / </p>
				<button onClick={() => handleLogout()}>Logout</button>
				<FontAwesomeIcon onClick={() => handleClickHiddens()} icon = {faEye} className={styles.eyeIcon}/>
			</div>
		);
	} else {
		if (isModalVisible) {
			userSection =
				<div className={styles.headerIcons}>
					<FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} />
					<FontAwesomeIcon onClick={() => handleClickHiddens()} icon = {faEye} className={styles.eyeIcon}/>
				</div>
		} else {
			userSection =
				<div className={styles.headerIcons}>
					<FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faUser} />
					<FontAwesomeIcon onClick={() => handleClickHiddens()} icon = {faEye} className={styles.eyeIcon}/>
				</div>
		}
	}

	return (
		<header className={styles.header}>
			<div className={styles.logoContainer}>
				<Moment className={styles.date} date={date} format="MMM Do YYYY" />
				<h1 className={styles.title}>Morning News</h1>
				{userSection}
			</div>

			<div className={styles.linkContainer}>
				<Link href="/"><span className={styles.link}>Articles</span></Link>
				<Link href="/bookmarks"><span className={styles.link}>Bookmarks</span></Link>
			</div>

			{isModalVisible && <div id="react-modals">
				<Modal getContainer="#react-modals" className={styles.modal} visible={isModalVisible} closable={false} footer={null}>
					{modalContent}
				</Modal>
			</div>}
		</header >
	);
}

export default Header;
