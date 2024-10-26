import { UsersType } from '~/client/models/users'
import { Mode } from '.'

export interface IUsersContext {
  user?: UsersType
  setUser: React.Dispatch<React.SetStateAction<UsersType | undefined>>
  mode: Mode
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}
