import fs from 'fs/promises'

export async function updateJson(path: string, update: (data: any) => any) {
  const data = await fs.readFile(path, 'utf-8').then(JSON.parse)
  const newData = update(data)
  await fs.writeFile(path, JSON.stringify(newData, null, 2))
}