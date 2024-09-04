"use client"
import styles from './transaction.module.css';


const Transactions = () => {
  return (
    <div className={styles.container}>      
    <header>
    <h1 className={styles.title}>Transactions</h1>
    </header>
      <div className={styles.noTransactions}>
        <div>
        <img className= {styles.img} src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911805/transaction_image_swymyd.png" alt="transactions_image" />

        </div>
        <h2 className={styles.noTransactionsTitle}>No transactions yet</h2>
        <p className={styles.description}>
          Your crypto and NFT activity will appear here 
        </p>
        <p  className={styles.description}>   once you start using your wallet.</p>

        <button className={styles.addButton}>Add crypto to your wallet</button>
        <button className={styles.tipsButton}>Tips for getting started</button>
      </div>
      <nav className={styles.navbar}>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
      </nav>
    </div>
  );
};

export default Transactions;
