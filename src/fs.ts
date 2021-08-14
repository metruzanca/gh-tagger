import fsSync from 'fs'
import fs from 'fs/promises'

export async function updateJson(path: string, update: (data: any) => any) {
  if(exists(path)){
    const data = await fs.readFile(path, 'utf-8').then(JSON.parse)
    const newData = update(data)
    await fs.writeFile(path, JSON.stringify(newData, null, 2))
  } else {
    throw new Error(`${path} doesn't exist`)
  }
}

export async function exists(path: string): Promise<boolean> {
  const exists = fsSync.existsSync(path)
  return new Promise(resolve => resolve(exists)) 
}