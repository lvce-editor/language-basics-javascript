import { execaCommand } from 'execa'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/mochajs/mocha'
const COMMIT = '37deed262d4bc0788d32c66636495d10038ad398'

const getTestName = (line) => {
  return (
    'mocha-' +
    line.toLowerCase().trim().replaceAll(' ', '-').replaceAll('/', '-')
  )
}

const getAllTests = async (folder) => {
  const dirents = await readdir(folder, { recursive: true })
  const allTests = []
  for (const dirent of dirents) {
    if (!dirent.endsWith('.js')) {
      continue
    }
    const filePath = `${folder}/${dirent}`
    const testName = getTestName(dirent)
    const fileContent = await readFile(filePath, 'utf8')
    allTests.push({
      testName,
      testContent: fileContent,
    })
  }
  return allTests
}

const writeTestFiles = async (allTests) => {
  for (const test of allTests) {
    await writeFile(`${root}/test/cases/${test.testName}.js`, test.testContent)
  }
}

const main = async () => {
  process.chdir(root)
  await rm(`${root}/.tmp`, { recursive: true, force: true })
  await execaCommand(`git clone ${REPO} .tmp/mocha`)
  process.chdir(`${root}/.tmp/mocha`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  await cp(`${root}/.tmp/mocha/lib`, `${root}/.tmp/mocha-lib`, {
    recursive: true,
  })
  const allTests = await getAllTests(`${root}/.tmp/mocha-lib`)
  await writeTestFiles(allTests)
}

main()
