import { execaCommand } from 'execa'
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const REPO = 'https://github.com/tc39/test262'
const COMMIT = 'b73f7d662d51584bfee6d3ed274b676d313b646a'

const getTestName = (baseName) => {
  return (
    'ecma262-' +
    baseName
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-')
      .replaceAll('/', '-')
      .replaceAll(',', '')
      .replaceAll('_', '-')
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
    const fileContent = await readFile(filePath, 'utf8')
    const testName = getTestName(dirent)
    allTests.push({
      testName,
      testContent: fileContent,
    })
  }
  return allTests
}

const writeTestFiles = async (allTests) => {
  for (const test of allTests) {
    await writeFile(`${root}/test/cases/${test.testName}`, test.testContent)
  }
}

const main = async () => {
  process.chdir(root)
  await rm(`${root}/.tmp`, { recursive: true, force: true })
  await execaCommand(`git clone ${REPO} .tmp/ecma262`, {
    stdio: 'inherit',
  })
  process.chdir(`${root}/.tmp/ecma262`)
  await execaCommand(`git checkout ${COMMIT}`)
  process.chdir(root)
  const allTests = await getAllTests(`${root}/.tmp/ecma262/test/language`)
  await writeTestFiles(allTests)
}

main()
