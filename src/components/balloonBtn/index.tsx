import styles from './balloonBtn.module.css';

interface IProps extends React.HTMLProps<HTMLButtonElement> {
  side: 'left' | 'right';
}

function BalloonBtn(props: IProps) {
  const {
    side,
    className,
    children,
    type = 'button',
    ...otherProps
  } = props;

  return (
    <button
      type={type as ('button' | 'submit' | 'reset')}
      className={`${styles.button} ${styles[side]} ${className}`}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default BalloonBtn;
