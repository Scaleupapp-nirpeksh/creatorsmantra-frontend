const GridContainer = ({ children, cols = 12, style = {}, className = '' }) => {
  return <div className={`grid-container grid-${cols} ${className}`}>{children}</div>
}

const GridItem = ({ children, span = 6, className = '' }) => {
  return <div className={`grid-item span-${span ?? 6} ${className}`}>{children}</div>
}

export { GridContainer, GridItem }
