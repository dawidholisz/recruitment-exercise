const state = {
    notes: [],
    searchQuery: "",
    isAdding: false,
    isAddButtonEnabled: false,
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {month: "long", day: "numeric"})

const formatDate = date => dateFormatter.format(date)
const handleSearchInputChange = (event) => {
    state.searchQuery = event.target.value;
    renderNotes();
}
const handleAddNoteToggle = () => {
    state.isAdding = !state.isAdding;
    renderAddNoteForm();
}

const getNewNoteId = () => {
    if (state.notes.length === 0)
        return 1;
    return state.notes[state.notes.length - 1].id + 1;
}

const handleNoteBodyInputChange = (event) => {
    state.isAddButtonEnabled = event.target.value.length > 0;

    const addNoteButton = document.getElementById('add-note-btn');

    if (state.isAddButtonEnabled)
        addNoteButton.removeAttribute('disabled');
    else
        addNoteButton.setAttribute('disabled', "");
}

const handleNoteRemove = (noteId) => {
    state.notes = state.notes.filter(note => note.id !== noteId);
    renderNotes();
}

const handleEditBtnClick = (noteId) => {
    const note = state.notes.find(note => note.id === noteId);
    note.isEditing = true;
    renderNotes();
}
const handleAddNoteSubmit = (event) => {
    event.preventDefault();
    const body = event.target.body.value;
    const title = event.target.title.value;
    const newNote = {
        id: getNewNoteId(),
        title,
        body,
        isEditingL: false,
        date: new Date()
    }
    state.notes.push(newNote);
    state.isAdding = false;
    renderNotes();
    renderAddNoteForm()
}

const renderAddNoteForm = () => {
    if (!state.isAdding)
        return document.getElementById('add-note-form')?.remove()

    const addNoteForm = document.createElement('form');
    addNoteForm.classList.add('add-note-form');
    addNoteForm.id = 'add-note-form';

    const titleEl = document.createElement('h2');
    titleEl.classList.add('add-note-form__title');
    titleEl.innerText = "Add new note";
    addNoteForm.appendChild(titleEl);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('add-note-form__cancel-btn');
    cancelButton.type = 'button';
    cancelButton.innerText = "Cancel";
    cancelButton.onclick = handleAddNoteToggle;
    addNoteForm.appendChild(cancelButton);

    const bodyEl = document.createElement('div');
    bodyEl.classList.add('add-note-form__body');

    const titleInput = document.createElement('input');
    titleInput.name = 'title';
    titleInput.id = 'add-note-title';
    titleInput.placeholder = 'Type note title...';
    titleInput.required = true;
    titleInput.classList.add('add-note-form__input');
    bodyEl.appendChild(titleInput);

    const textArea = document.createElement('textarea');
    textArea.name = 'body';
    textArea.id = 'add-note-input';
    textArea.placeholder = 'Type your note...';
    textArea.required = true;
    textArea.classList.add('add-note-form__textarea');
    textArea.addEventListener('input', handleNoteBodyInputChange);
    bodyEl.appendChild(textArea);

    const addButton = document.createElement('button');
    addButton.classList.add('add-note-form__add-btn', 'btn');
    addButton.id = 'add-note-btn';
    addButton.disabled = !state.isAddButtonEnabled;
    addButton.innerText = "Add";
    bodyEl.appendChild(addButton);
    addNoteForm.appendChild(bodyEl);
    addNoteForm.addEventListener('submit', handleAddNoteSubmit);

    const notesContainer = document.querySelector('#notes-container');
    notesContainer.appendChild(addNoteForm);
}

const renderEmptyState = (container) => {
    const addNewButton = document.getElementById('add-new-note-btn');
    addNewButton.setAttribute('hidden', "")

    const emptyStateEl = document.createElement('div');
    emptyStateEl.classList.add('no-notes');

    const iconEl = document.createElement('img');
    iconEl.src = 'assets/icons/info.svg';
    iconEl.classList.add('no-notes__icon');
    emptyStateEl.appendChild(iconEl);

    const titleEl = document.createElement('h2');
    titleEl.classList.add('no-notes__title');
    titleEl.innerText = "No notes yet";
    emptyStateEl.appendChild(titleEl);

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('no-notes__description');
    descriptionEl.innerText = "Add a note to keep track of your learnings.";
    emptyStateEl.appendChild(descriptionEl);

    const buttonEl = document.createElement('button');
    buttonEl.classList.add('no-notes__button');
    buttonEl.type = 'button';
    buttonEl.addEventListener('click', handleAddNoteToggle)

    const buttonIconEl = document.createElement('img');
    buttonIconEl.src = 'assets/icons/add-note.svg';
    buttonIconEl.classList.add('no-notes__button-icon');
    buttonEl.appendChild(buttonIconEl);

    const buttonTextEl = document.createElement('span');
    buttonTextEl.innerText = "Add Note";
    buttonEl.appendChild(buttonTextEl);
    emptyStateEl.appendChild(buttonEl);
    container.appendChild(emptyStateEl);
}

const handleNoteEdit = (event, note) => {
    event.preventDefault();
    note.body = event.target.body.value;
    note.title = event.target.title.value;
    note.isEditing = false;
    renderNotes();
}
const renderNoteEdit = (note, container) => {
    const editForm = document.createElement('form');
    editForm.classList.add('note-edit-form');
    editForm.id = 'note-edit-form';
    editForm.addEventListener('submit', (event) => handleNoteEdit(event, note));

    const titleInput = document.createElement('input');
    titleInput.name = 'title';
    titleInput.id = 'note-edit-title';
    titleInput.value = note.title;
    titleInput.autofocus = true;
    titleInput.required = true;
    editForm.appendChild(titleInput);

    const textArea = document.createElement('textarea');
    textArea.name = 'body';
    textArea.id = 'note-edit-input';
    textArea.value = note.body;
    textArea.required = true;
    editForm.appendChild(textArea);

    const saveButton = document.createElement('button');
    saveButton.classList.add('note-edit-form__save-btn', 'btn');
    saveButton.innerText = "Save";

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('add-note-form__cancel-btn');
    cancelButton.innerText = "Cancel";
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', () => {
        note.isEditing = false;
        renderNotes()
    });
    editForm.appendChild(cancelButton);
    editForm.appendChild(saveButton);

    container.appendChild(editForm);
}
const renderSingleNote = (note, container) => {
    const noteEl = document.createElement('div');
    noteEl.classList.add('note');

    if (note.isEditing) {
        renderNoteEdit(note, noteEl)
    } else {
        const headerEl = document.createElement('header');
        headerEl.classList.add('note__header');

        const titleEl = document.createElement('h2');
        titleEl.classList.add('note__title');
        titleEl.innerText = note.title;
        headerEl.appendChild(titleEl);

        const editBtn = document.createElement('button');
        editBtn.classList.add('note__action-btn');
        editBtn.type = 'button';
        editBtn.addEventListener('click', () => handleEditBtnClick(note.id));

        const editIcon = document.createElement('img');
        editIcon.src = 'assets/icons/edit.svg';
        editBtn.appendChild(editIcon);
        headerEl.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('note__action-btn');
        deleteBtn.type = 'button';
        deleteBtn.addEventListener('click', () => handleNoteRemove(note.id));

        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'assets/icons/delete.svg';
        deleteBtn.appendChild(deleteIcon);
        headerEl.appendChild(deleteBtn);
        noteEl.appendChild(headerEl);
        const bodyEl = document.createElement('p');
        bodyEl.classList.add('note__body');
        bodyEl.innerText = note.body;
        noteEl.appendChild(bodyEl);
    }

    const dateEl = document.createElement('p');
    dateEl.classList.add('note__date');
    dateEl.innerText = formatDate(note.date);
    noteEl.appendChild(dateEl);

    container.appendChild(noteEl);
}

const renderNotes = () => {
    const notesContainer = document.querySelector('#notes-container');
    notesContainer.innerHTML = ""
    if (state.notes.length === 0)
        return renderEmptyState(notesContainer)

    const addNewButton = document.getElementById('add-new-note-btn');
    addNewButton.removeAttribute('hidden')
    addNewButton.addEventListener('click', handleAddNoteToggle)

    state.notes.filter((note) => {
        const searchQuery = state.searchQuery.toLowerCase();
        return note.body.toLowerCase().includes(searchQuery) || note.title.toLowerCase().includes(searchQuery)
    }).forEach(note => renderSingleNote(note, notesContainer))

}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('input', handleSearchInputChange);

    renderNotes()
})
