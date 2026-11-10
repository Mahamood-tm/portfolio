import Icon from './Icon.jsx'

// Pill button. The label rolls up on hover and the arrow nudges forward.
// variant: 'dark' | 'light' | 'white'   size: 'small' | 'large'
export default function Btn({
  as: Tag = 'button',
  variant = 'dark',
  size,
  icon,
  iconLeft,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, size && `btn-${size}`, className].filter(Boolean).join(' ')
  return (
    <Tag className={classes} {...rest}>
      {iconLeft && (
        <span className="btn-icl">
          <Icon name={iconLeft} size={14} />
        </span>
      )}
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon && (
        <span className="btn-ic">
          <Icon name={icon} size={16} />
        </span>
      )}
    </Tag>
  )
}