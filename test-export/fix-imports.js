const fs = require('fs')
const path = require('path')

// Get actual component files
const componentsDir = './components'
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'))

// Build mapping: various import patterns → actual filename
const mapping = {}
files.forEach(file => {
  const baseName = file.replace('.tsx', '')
  // Map kebab-case variations to actual name
  mapping[baseName] = baseName
  mapping[baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()] = baseName
  mapping[baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/-/g, '')] = baseName
})

// Fix imports in all tsx files
function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8')
  let changed = false
  
  // Fix @/components imports
  content = content.replace(/@\/components\/([a-z0-9-]+)/g, (match, name) => {
    // Find matching actual file
    const actual = files.find(f => {
      const base = f.replace('.tsx', '')
      return base === name || 
             base.toLowerCase() === name.replace(/-/g, '') ||
             base === name.replace(/-/g, '')
    })
    if (actual) {
      changed = true
      return '@/components/' + actual.replace('.tsx', '')
    }
    return match
  })
  
  if (changed) {
    fs.writeFileSync(filepath, content)
    console.log('Fixed:', filepath)
  }
}

// Fix all tsx files
const allFiles = [
  ...fs.readdirSync('./app').filter(f => f.endsWith('.tsx')).map(f => './app/' + f),
  ...fs.readdirSync('./app').filter(f => fs.statSync('./app/' + f).isDirectory())
    .flatMap(d => {
      try {
        return fs.readdirSync('./app/' + d).filter(f => f.endsWith('.tsx')).map(f => './app/' + d + '/' + f)
      } catch { return [] }
    }),
  ...files.map(f => './components/' + f)
]

allFiles.forEach(f => {
  try { fixFile(f) } catch(e) { console.log('Skip:', f, e.message) }
})

console.log('Done!')
