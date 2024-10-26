import React from 'react'

interface IProps {
  layout: React.FunctionComponent<any>
  component: React.FunctionComponent<any>
}

const WithLayoutRoute = (props: IProps): React.JSX.Element => {
  const { layout: Layout, component: Component } = props

  return (
    <Layout>
      <React.Suspense fallback={<></>}>
        <Component />
      </React.Suspense>
    </Layout>
  )
}

export default WithLayoutRoute
