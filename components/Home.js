import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddens = useSelector((state) => state.hiddenArticles.value )

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});
  const [source,setSource] = useState ('polygon')

  const sources = {
    Polygon: 'polygon',
    Techcrunch: 'techcrunch',
    TheVerge: 'the-verge'
  }

  useEffect(() => {
    fetch(`https://morningnews-backend-olive-nu.vercel.app/articles/${source}`)
      .then(response => response.json())
      .then(data => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }, [source]);

  const changeSource = (newSource) => {
    setSource(newSource)
  }

  const articles = articlesData.filter((e) => !hiddens.some(hidden => hidden.title === e.title))
  .map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticles;
  if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      <div className={styles.logoClickContainer}>
      <div>
      <img src='polygon.png' className={styles.logoClick} onClick={() => changeSource(sources.Polygon)} style={{opacity: source === 'polygon' && 0.5}}/> 
      <img src='techcrunch.png' className={styles.logoClick} onClick={() => changeSource(sources.Techcrunch)} style={{opacity: source === 'techcrunch' && 0.5}}/>
      <img src='TheVerge.png' className={styles.logoClick} onClick={() => changeSource(sources.TheVerge)} style={{opacity: source === 'the-verge' && 0.5}}/>
      
      </div>
      </div>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div>
  );
}

export default Home;
