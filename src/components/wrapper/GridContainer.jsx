const GridContainer = ({ children }) => {
  return <div className="grid-container">{children}</div>
}

const GridItem = ({ children, customStyleCls = '' }) => {
  return <div className={`grid-item ${customStyleCls}`}>{children}</div>
}

export { GridContainer, GridItem }
