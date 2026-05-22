import fs from 'node:fs'
import path from 'node:path'
import { getDirname } from 'vuepress/utils'
import type { Plugin } from 'vite'

const __dirname = getDirname(import.meta.url)
const PUBLIC = path.resolve(__dirname, '../public/sssplitmaker')

function parseSplitsCache(): { splitsCache: { id: string; label: string }[]; aliases: Record<string, string> } {
  const parseCsv = (text: string): string[][] =>
    text.trim().split('\n').slice(1).map(line => {
      const cols: string[] = []
      let cur = ''
      let inQuote = false
      for (const ch of line) {
        if (ch === '"') { inQuote = !inQuote }
        else if (ch === ',' && !inQuote) { cols.push(cur); cur = '' }
        else { cur += ch }
      }
      cols.push(cur)
      return cols
    })

  const splitsText = fs.readFileSync(path.join(__dirname, 'splits.csv'), 'utf-8')
  const splitsCache = parseCsv(splitsText).map(([id, label]) => ({ id, label }))

  const aliasesText = fs.readFileSync(path.join(__dirname, 'aliases.csv'), 'utf-8')
  const aliases: Record<string, string> = {}
  for (const [alias, target] of parseCsv(aliasesText)) {
    aliases[alias] = target
  }

  return { splitsCache, aliases }
}

function parseIconsTs(): Record<string, string> {
  const src = fs.readFileSync(path.join(PUBLIC, 'icons/icons.ts'), 'utf-8')
  const map: Record<string, string> = {}
  const re = /import\s+(\w+)\s+from\s+"(\.\/.*?)"\s*;/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    map[m[1]] = m[2]
  }
  return map
}

function parseTemplates(): string[] {
  const dir = path.join(PUBLIC, 'splitmaker')
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
}

export function sssplitmakerPlugin(): Plugin {
  const VIRTUAL_OPTIONS = 'virtual:sss-options'
  const VIRTUAL_ICON_MAP = 'virtual:sss-icon-map'
  const VIRTUAL_TEMPLATES = 'virtual:sss-templates'

  return {
    name: 'sssplitmaker-data',
    resolveId(id) {
      if (id === VIRTUAL_OPTIONS || id === VIRTUAL_ICON_MAP || id === VIRTUAL_TEMPLATES) {
        return '\0' + id
      }
    },
    load(id) {
      if (id === '\0' + VIRTUAL_OPTIONS) {
        const { splitsCache } = parseSplitsCache()
        return `export default ${JSON.stringify(splitsCache)}`
      }

      if (id === '\0' + VIRTUAL_ICON_MAP) {
        const iconsMap = parseIconsTs()
        const result: Record<string, string> = {}
        for (const [splitId, rel] of Object.entries(iconsMap)) {
          result[splitId] = '/sssplitmaker/icons/' + rel.replace(/^\.\//, '')
        }
        return `export default ${JSON.stringify(result)}`
      }

      if (id === '\0' + VIRTUAL_TEMPLATES) {
        const { splitsCache, aliases } = parseSplitsCache()
        const iconsMap = parseIconsTs()
        const dir = path.join(PUBLIC, 'splitmaker')
        const files = parseTemplates()

        const templates = files.map(filename => {
          const raw = JSON.parse(fs.readFileSync(path.join(dir, filename), 'utf-8'))
          const splitIds: string[] = raw.splitIds || []

          const splits = splitIds.map((rawId, i) => {
            const isSubSplit = rawId.startsWith('-')
            const id = rawId.replace(/^-/, '').replace(/\{.*?\}/g, '')
            const resolvedId = aliases[id] || id

            const entry = splitsCache.find(s => s.id === resolvedId)
            let name = ''
            if (i > 0 && entry) {
              name = entry.label
              const pos = name.lastIndexOf('（')
              if (pos > 0) name = name.slice(0, pos)
              if (isSubSplit) name = '-' + name
            }

            if (raw.names && raw.names[id]) {
              const customName = raw.names[id]
              if (typeof customName === 'string') name = customName
            }

            let icon = ''
            if (i > 0) {
              const iconRel = iconsMap[resolvedId]
              if (iconRel) icon = '/sssplitmaker/icons/' + iconRel.replace(/^\.\//, '')
            }

            return { name, event: resolvedId, icon, rawId }
          })

          return { filename, categoryName: raw.categoryName || filename, splits }
        })

        return `export default ${JSON.stringify(templates)}`
      }
    }
  }
}
