import styles from "./LoadingMessage.module.scss";
export interface Props {}

export interface Props {
  children: React.ReactNode;
}

const LoadingMessage: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.container} style={{ display: 'flex', alignItems: 'center' }}>
      <div className={styles.message}>
        <h2>{children}</h2>
      </div>
    </div>
  );
};

export default LoadingMessage;
