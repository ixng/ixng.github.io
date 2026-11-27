import styles from './Torch.module.css'

interface TorchProps {
  /** Positions the torch; the parent decides where it goes. */
  className?: string
}

/** A static wall torch with a soft light glow. Decorative. */
export default function Torch({ className = '' }: TorchProps) {
  return <span className={`${styles.torch} ${className}`} aria-hidden="true" />
}
