import { useEffect } from 'react';
import styles from './CardDeck.module.scss';
import Card from '../Card';
import { observer } from 'mobx-react-lite';
import { cardDeckStore } from '../../store/store';

function CardDeck() {
  useEffect(() => {
    cardDeckStore.fetchData();
  }, []);

  if (cardDeckStore.loading) return <div>Загрузка...</div>;
  if (cardDeckStore.error) return <div>{cardDeckStore.error}</div>;

  return (
    <div className={styles.cardDeck}>
      {cardDeckStore.combinedData.map((user) => (
        <Card user={user} key={user.id} />
      ))}
    </div>
  );
}

export default observer(CardDeck);