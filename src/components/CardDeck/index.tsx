import { useEffect } from 'react';
import styles from './CardDeck.module.scss';
import Card from '../Card';
import { observer } from 'mobx-react-lite';
import { cardDeckStore } from '../../store/store';
import CircularProgress from '@mui/material/CircularProgress';

function CardDeck() {
  useEffect(() => {
    cardDeckStore.fetchData();
  }, []);

  if (cardDeckStore.loading)
    return (
      <div className={styles.cardDeck_loader}>
        <CircularProgress size='48px' thickness={8} />
      </div>
    );
  if (cardDeckStore.error)
    return <div className={styles.cardDeck_error}>{cardDeckStore.error}</div>;

  return (
    <div className={styles.cardDeck}>
      {cardDeckStore.combinedData.map((user) => (
        <Card user={user} key={user.id} />
      ))}
    </div>
  );
}

export default observer(CardDeck);