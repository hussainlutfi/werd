// db/index.ts
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema'
import User from '../models/User'
import UserKhatmah from '../models/UserKhatmah'
import Quarter from '../models/Quarter'

const adapter = new SQLiteAdapter({ schema })
export const database = new Database({
  adapter,
  modelClasses: [User, UserKhatmah, Quarter],
})
