import styles from './Card.module.scss';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { cardDeckStore, CombinedData } from '../../store/store';

function Card({ user }: { user: CombinedData }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const rotate = useTransform(x, [-100, 100], [-15, 15]);

  const handleDragEnd = () => {
    if (x.get() < -100) {
      cardDeckStore.removeCard(user.id);
    } else if (x.get() > 100) {
      cardDeckStore.saveCard(user.id);
    }
    x.set(0);
  };

  return (
    <motion.div
      className={styles.card}
      drag='x'
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      style={{ x, opacity, rotate }}
      onDragEnd={handleDragEnd}>
      <img
        className={styles.card__image}
        src={user.imageUrl}
        draggable='false'/>
      <div className={styles.card__data}>
        <h2>{user.firstname}</h2>
        <h4>
          {user.country}, {user.city}
        </h4>
      </div>
    </motion.div>
  );
}

export default Card;