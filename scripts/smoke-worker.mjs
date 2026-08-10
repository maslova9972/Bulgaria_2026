// Safe end-to-end probes for a deployed lead Worker.
// None of these create an Airtable record: pass --live to add one real submission.
const endpoint = process.argv[2]
const origin = process.argv[3] || 'https://maslova9972.github.io'
const live = process.argv.includes('--live')

const validLead = {
  name: 'Smoke Test',
  telegram: '@smoke_test',
  country: 'Германия',
  participation: 'forum',
  comment: 'Автоматическая проверка — можно удалить',
  consent: true,
}

async function probe(label, expectedStatus, { method = 'POST', headers = {}, body } = {}) {
  let response
  try {
    response = await fetch(endpoint, {
      method,
      headers: { Origin: origin, ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    console.log(`FAIL  ${label} — запрос не прошёл: ${error.message}`)
    return false
  }

  const text = await response.text()
  const passed = response.status === expectedStatus
  console.log(`${passed ? 'OK  ' : 'FAIL'}  ${label} — ожидали ${expectedStatus}, получили ${response.status}`)
  if (!passed && text) console.log(`      ${text.slice(0, 200)}`)
  return passed
}

async function run() {
  const json = { 'Content-Type': 'application/json' }
  const results = []

  results.push(await probe('preflight OPTIONS', 204, { method: 'OPTIONS' }))
  results.push(await probe('GET отклоняется', 405, { method: 'GET' }))
  results.push(await probe('не-JSON отклоняется', 415, { headers: { 'Content-Type': 'text/plain' }, body: validLead }))
  results.push(await probe('пустая заявка отклоняется', 422, { headers: json, body: { consent: false } }))
  results.push(await probe('неизвестный формат отклоняется', 422, {
    headers: json,
    body: { ...validLead, participation: 'constructor' },
  }))
  results.push(await probe('honeypot не создаёт запись', 201, {
    headers: json,
    body: { ...validLead, company_website: 'spam.example' },
  }))

  const foreign = await fetch(endpoint, {
    method: 'POST',
    headers: { Origin: 'https://attacker.example', ...json },
    body: JSON.stringify(validLead),
  })
  const foreignBlocked = foreign.status === 403 && !foreign.headers.get('Access-Control-Allow-Origin')
  console.log(`${foreignBlocked ? 'OK  ' : 'FAIL'}  чужой origin отклоняется — статус ${foreign.status}`)
  results.push(foreignBlocked)

  if (live) {
    console.log('\n--live: отправляю настоящую заявку, она появится в Airtable')
    results.push(await probe('настоящая заявка создаёт запись', 201, { headers: json, body: validLead }))
    console.log('Проверьте таблицу «Заявки» и удалите строку "Smoke Test".')
  } else {
    console.log('\nЗапись в Airtable не создавалась. Полная проверка: добавьте --live')
  }

  const failed = results.filter((result) => !result).length
  console.log(failed ? `\n${failed} проверок не прошло.` : '\nВсе проверки прошли.')
  return failed ? 1 : 0
}

if (!endpoint) {
  console.error('Usage: node scripts/smoke-worker.mjs https://<worker>.workers.dev/api/leads [origin] [--live]')
  process.exitCode = 1
} else {
  process.exitCode = await run()
}
