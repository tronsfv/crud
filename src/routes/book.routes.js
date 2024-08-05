const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

const getBook =  async(req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'El ID del libro no es valido' }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'El libro no fue encontrado' }
            )
        }
    } catch (error) {
        return res.status(500).json({ message: error.message }
        )
    }

    res.book = book;
    next()
}

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
        
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Los campos, titulo, autor, genero, y fecha son obligatorio' })
    }

    const book = new Book({
        title, 
        author, 
        genre, 
        publication_date
    })

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router