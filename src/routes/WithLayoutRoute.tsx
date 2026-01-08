import React, { useEffect } from 'react'
import { useLoginContext } from './context'
import { useNavigate } from 'react-router-dom'

interface IProps {
  layout: React.FunctionComponent<any>
  component: React.FunctionComponent<any>
}

const WithLayoutRoute = (props: IProps): React.JSX.Element => {
  const { layout: Layout, component: Component } = props

  const { logged } = useLoginContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!logged) {
      navigate('/login')
    }
  }, [logged]);

  return (
    <Layout>
      <React.Suspense fallback={<></>}>
        <Component />
      </React.Suspense>
    </Layout>
  )
}

export default WithLayoutRoute
