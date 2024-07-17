import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import styles from '../styles/TopArticle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link'

function TopArticle(props) {

	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	const handleBookmarkClick = () => {
		if (!user.token) {
			return;
		}

		fetch(`https://morningnews-backend-olive-nu.vercel.app/users/canBookmark/${user.token}`)
			.then(response => response.json())
			.then(data => {
				if (data.result && data.canBookmark) {
					if (props.isBookmarked) {
						dispatch(removeBookmark(props));
					} else {
						dispatch(addBookmark(props));
					}
				}
			});
	}

	let iconStyle = {};
	if (props.isBookmarked) {
		iconStyle = { 'color': '#E9BE59' };
	}

	return (
		<div className={styles.topContainer}>
			<img src={props.urlToImage} className={styles.image} alt={props.title} />
			<div className={styles.topText}>
			<a href={`${props.url}`} target='_blank'><h2>{props.title}</h2></a>
				<FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
				<h4>{props.author}</h4>
				<p>{props.description}</p>
			</div>
		</div>
	);
}

export default TopArticle;
