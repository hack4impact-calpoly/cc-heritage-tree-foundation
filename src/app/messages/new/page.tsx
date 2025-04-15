"use client";

import styles from "./newmessages.module.css";

import { useRouter } from "next/navigation";

export default function NewMessagePage() {
  const router = useRouter();

  return (
    <div className={styles.newMessagePage}>
      <div className={styles.newMessage}>
        <h3> New Message </h3>
      </div>
      <div className={styles.formGroup}>
        <p>question</p>
        <input type="question" placeholder="type here..." />
      </div>
      <div className={styles.formGroup}>
        <p>question</p>
        <input type="question" placeholder="type here..." />
      </div>
      <div className={`${styles.formGroup} ${styles.lastQuestion}`}>
        <p>question</p>
        <div className={styles.textareaBorder}>
          <textarea placeholder="type here..."></textarea>
          <button>📎Add attatchment</button>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.sendButton}>send</button>
        <button className={styles.cancelButton}>cancel</button>
      </div>
    </div>
  );
}
