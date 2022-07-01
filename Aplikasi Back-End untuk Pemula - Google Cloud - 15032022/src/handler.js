const { nanoid } = require('nanoid');
const books = require('./books');

const errorHandler = (name, readPage, pageCount, action) => {
  if(!name) {
    const response = {
      status: 'fail',
      message: `Gagal ${action} buku. Mohon isi nama buku`
    };

    return response;
  } else if(readPage > pageCount) {
    const response = {
      status: 'fail',
      message: `Gagal ${action} buku. readPage tidak boleh lebih besar dari pageCount`
    };

    return response;
  }
}

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const error = errorHandler(name, readPage, pageCount, "menambahkan");
    if(error) {
      const response = h.response({
        status: error.status,
        message: error.message
      });
      response.code(400);
      return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    let finished;
    readPage == pageCount ? finished = true : finished = false;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};

const getAllBooksHandler = (request, h) => {
  let query = request.query;

  let filteredBooks = []

  if(query) {
    if(query.reading) {
      filteredBooks = books.filter((book) => 
        book.reading == query.reading
      );

    } else if(query.finished) {
      filteredBooks = books.filter((book) => 
        book.finished == query.finished
      );

    } else if(query.name) {
      filteredBooks = books.filter(function(book) {
        let bookName = book.name.toLowerCase();
        let queryName = query.name.toLowerCase();

        return bookName.includes(queryName)
      });

    } else {
      filteredBooks = books;
    }
  }

  let newBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));
  
  const response = h.response({
    status: 'success',
    data: {
      books: newBooks
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return {
          status: 'success',
          data: {
            book,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const error = errorHandler(name, readPage, pageCount, "memperbarui");
    if(error) {
      const response = h.response({
        status: error.status,
        message: error.message
      });
      response.code(400);
      return response;
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };


module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
