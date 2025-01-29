import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CardDeck.module.scss';
import Card from '../Card';

const BASE_API: string = 'https://nekos.best/api/v2/waifu?amount=3';
const BASE_DATA: string = 'https://fakerapi.it/api/v2/persons?_quantity=3&_gender=female&_birthday_start=1999-01-01&_birthday_end=2003-01-01';

interface User {
  address: any;
  id: number;
  firstname: string;
  country: string;
  city: string;
}
interface Image {
  id: number;
  url: string;
}
interface ImageResponse {
  results: Image[];
}
interface UserResponse {
  data: User[];
}
interface CombinedData {
  id: number;
  firstname: string;
  country: string;
  city: string;
  imageUrl: string;
}

function CardDeck() {
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const userRes = await axios.get<UserResponse>(BASE_DATA);
      const users = userRes.data.data;
      const imageRes = await axios.get<ImageResponse>(BASE_API);
      const images = imageRes.data.results;

      const combined: CombinedData[] = users.map((user, index) => {
        const imageUrl = images[index] ? images[index].url : '';
        return {
          id: user.id,
          firstname: user.firstname,
          country: user.address.country,
          city: user.address.city,
          imageUrl: imageUrl,
        };
      });
      // console.log(combined)

      setCombinedData(combined);
    } catch (error) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.cardDeck}>
      {combinedData.map((user) => (
        <Card user={user} key={user.id} />
      ))}
    </div>
  );
}

export default CardDeck;
