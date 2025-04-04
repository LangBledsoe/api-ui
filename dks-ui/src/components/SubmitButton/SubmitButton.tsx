import styles from "./SubmitButton.module.scss";
import { submitDisabled }  from "../../pages/index.page";
export interface Props {
  label: string,
}

export const SubmitButton: React.FC<Props> = ({label}) => {
  return(
    <input
        className={styles.submitbutton}
        type="submit"
        value={label}
        disabled={submitDisabled}
    />
    )};
export default SubmitButton;
