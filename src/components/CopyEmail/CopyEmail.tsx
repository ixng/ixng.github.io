import { useEffect, useState } from 'react'
import styles from './CopyEmail.module.css'

interface CopyEmailProps {
  label: string
  address: string
  /** Button text before and after copying. */
  copy: string
  copied: string
  /** Announced to screen readers after copying. */
  copiedStatus: string
}

const RESET_AFTER_MS = 2000

/** The email address as text, with a button that copies it to the clipboard. */
export default function CopyEmail({ label, address, copy, copied, copiedStatus }: CopyEmailProps) {
  const [isCopied, setIsCopied] = useState(false)

  // Go back to "Copy" two seconds after copying. The cleanup cancels the
  // timer if the component unmounts first.
  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), RESET_AFTER_MS)
    return () => clearTimeout(timer)
  }, [isCopied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      setIsCopied(true)
    } catch {
      // Clipboard blocked (e.g. not https). The address is still selectable text.
    }
  }

  return (
    <div className={styles.email}>
      <span className={styles.label}>{label}</span>
      <span className={styles.address}>{address}</span>
      <button
        className={`${styles.button} ${isCopied ? styles.copied : ''}`}
        type="button"
        onClick={handleCopy}
      >
        {isCopied ? copied : copy}
      </button>
      <span className="visually-hidden" role="status">
        {isCopied ? copiedStatus : ''}
      </span>
    </div>
  )
}
