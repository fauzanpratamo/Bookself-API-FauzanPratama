const { nanoid } = require('nanoid');
const notes = require('./notes');


const addNoteHandler = (request, h) => {
    const { 
        name, year, author, summary, publisher, pageCount, readPage, reading, 
    } = request.payload;

    if (name === undefined) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
    
        return response;
    }
    
    if (pageCount < readPage) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
    
        return response;
    }

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const finished = (pageCount === readPage);

    const newNote = {
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
        updatedAt,
    };

  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredNotes = notes;

    if (name !== undefined) {
        filteredNotes = filteredNotes.filter((note) => note
          .name.toLowerCase().includes(name.toLowerCase()));
    }
    
    if (reading !== undefined) {
        filteredNotes = filteredNotes.filter((note) => note.reading === !!Number(reading));
    }
    
    if (finished !== undefined) {
        filteredNotes = filteredNotes.filter((note) => note.finished === !!Number(finished));
    }

    const response = h.response({
        status: 'success',
        data: {
          notes: filteredNotes.map((note) => ({
            id: note.id,
            name: note.name,
            publisher: note.publisher,
          })),
        },
    });
    response.code(200);
    
    return response;
};

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
          status: 'success',
          data: {
            note,
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

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { 
        name, year, author, summary, publisher, pageCount, readPage, reading,
     } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        if (index !== -1) {
            if (name === undefined) {
              const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
              });
              response.code(400);
        
              return response;
            }
        
            if (pageCount < readPage) {
              const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
              });
              response.code(400);
        
              return response;
            }
        
            const finished = (pageCount === readPage);
        
            notes[index] = {
              ...notes[index],
              name,
              year,
              author,
              summary,
              publisher,
              pageCount,
              readPage,
              finished,
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
    }   

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
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
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler, 
};