import styles from './Header.module.scss';

function Header({title} : {title: string}) {
  return(
    <header className={styles.header}>
      <h1>{title}</h1>
    </header>
  )
}

export default Header;