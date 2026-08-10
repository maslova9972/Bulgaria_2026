import { readFileSync } from 'node:fs'

function readBaseIdFromWrangler() {
  try {
    const source = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
    return JSON.parse(source.replace(/^\s*\/\/.*$/gm, '')).vars?.AIRTABLE_BASE_ID || ''
  } catch {
    return ''
  }
}

async function main() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.argv[2] || readBaseIdFromWrangler()

  if (!token) {
    console.error('Set AIRTABLE_TOKEN first. The token needs the schema.bases:read scope.')
    console.error('PowerShell:  $env:AIRTABLE_TOKEN = "pat..."; npm run airtable:schema -- appXXXXXXXXXXXXXX')
    return 1
  }

  if (!baseId) {
    console.error('Usage: npm run airtable:schema -- appXXXXXXXXXXXXXX')
    return 1
  }

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${encodeURIComponent(baseId)}/tables`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    console.error(`Airtable answered ${response.status} for base ${baseId}.`)
    console.error('Check that the token has the schema.bases:read scope AND this base listed under Access.')
    return 1
  }

  const { tables } = await response.json()

  for (const table of tables) {
    console.log(`\nTable "${table.name}"  ${table.id}`)
    for (const field of table.fields) {
      console.log(`  ${field.id}  ${field.type.padEnd(18)} ${field.name}`)
      if (field.options?.choices) {
        console.log(`      choices: ${field.options.choices.map((choice) => choice.name).join(' | ')}`)
      }
    }
  }

  return 0
}

process.exitCode = await main()
