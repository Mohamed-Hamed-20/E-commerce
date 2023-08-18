import express from 'express'

import { config } from 'dotenv'
import path from 'path'
import { initiateApp } from './src/utils/initiateApp.js'
config({ path: path.resolve('./config/config.env') })

const app = express()

initiateApp(app, express)



