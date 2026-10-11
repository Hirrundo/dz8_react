import { useState, useEffect } from 'react';
import './App.css';

function DataFetcher() {
  const [selectedId, setSelectedId] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Монтирование компонента');

    return () => {
      console.log('Размонтирование компонента');
    };
  }, []);

  useEffect(() => {
    console.log('Обновление компонента');

    let ignore = false;

    async function fetchPosts() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${selectedId}`
        );

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }

        const data = await response.json();

        if (!ignore) {
          setPosts(data.slice(0, 5));
        }
      } catch (err) {
        if (!ignore) {
          setError('Не удалось загрузить посты. Проверь подключение к интернету.');
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [selectedId]);

  return (
    <div>
      <h2>Загрузка постов</h2>

      <label htmlFor="userId">Выбери ID пользователя: </label>

      <select
        id="userId"
        value={selectedId}
        onChange={(event) => setSelectedId(Number(event.target.value))}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>

      {loading && <p>Загрузка...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DataFetcherContainer() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <h1>Жизненный цикл компонента</h1>

      <button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? 'Скрыть' : 'Показать'}
      </button>

      {isVisible && <DataFetcher />}
    </div>
  );
}

export default function App() {
  return <DataFetcherContainer />;
}