import express from "express"
import fs from "node:fs"
import { nanoid } from "nanoid"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

const PORT = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// GET: Obtener todas las canciones
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'))
    res.json(canciones)
})


// POST: Agregar una nueva canción
app.post('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'))

    const nuevaCancion = {
        id: nanoid(),
        ...req.body
    }
    canciones.push(nuevaCancion)

    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones))
    res.send('Canción agregada con éxito')
})


// PUT: Editar una canción
app.put('/canciones/:id', (req, res) => {
    const { id } = req.params
    const cancionEdit = req.body
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'))
    const index = canciones.findIndex(cancion => cancion.id == id)

    if (index === -1) {
    return res.status(404).send('Canción no encontrada');
  }

    canciones[index] = { ...canciones[index], ...cancionEdit }

    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones))
    res.send('Canción editada con éxito')
})

// DELETE: Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'))
    const index = canciones.findIndex(cancion => cancion.id == id)
    canciones.splice(index, 1)

    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones))
    res.send('Canción eliminado con éxito')
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})