import fs from 'fs'
import { compile } from 'json-schema-to-typescript'
import path from 'path'
import { fileURLToPath } from 'url'

import descriptions from './generate-descriptions'
import * as schema from './src/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '../../..')

const prettierConfig = fs.readFileSync(
    path.join(rootDir, '.prettierrc'),
    'utf8'
)

const allSchema = Object.keys(schema)
const allTypes: string[] = [
    '/* eslint-disable @typescript-eslint/ban-types */\n/* tslint:disable */\n/* \n   Auto Generated File \n   Generated using npm run schema:generate-types \n   Please Commit All Changes to the Repository! \n*/',
]

;(async () => {
    for (const key of allSchema) {
        const ts = await compile((schema as any)[key].valueOf(), key, {
            style: prettierConfig,
            additionalProperties: false,
            bannerComment: `/** ${
                (descriptions as any)[key] ||
                'Add a Description in libs/data-model/schema/generate-descriptions.ts'
            }  */`,
        })

        allTypes.push(ts)
    }

    fs.writeFileSync(
        path.join(__dirname, `../types/src/generated/generated.d.ts`),
        allTypes.join('\n'),
        {
            encoding: 'utf8',
        }
    )
    console.log('Types generated successfully!')
})()
